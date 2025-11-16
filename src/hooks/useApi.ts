import { useMsal } from '@azure/msal-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosRequestConfig } from 'axios'

import { graphConfig } from '@/config/authConfig'

/**
 * User profile interface representing data from Microsoft Graph API
 * @interface UserProfile
 */
export interface UserProfile {
  /** User's display name */
  displayName: string
  /** User's email address */
  mail: string
  /** User's job title */
  jobTitle: string
  /** User's office location */
  officeLocation: string
  /** User's mobile phone number */
  mobilePhone: string
  /** Array of user's business phone numbers */
  businessPhones: string[]
  /** Unique user identifier */
  id: string
}

/**
 * Makes an authenticated HTTP request using axios
 *
 * @template T - The expected response data type
 * @param {string} url - The URL to fetch
 * @param {string} accessToken - Bearer token for authentication
 * @param {AxiosRequestConfig} [options] - Additional axios configuration options
 * @returns {Promise<T>} The response data
 * @throws {Error} When the request fails or returns an error
 *
 * @example
 * ```ts
 * const data = await fetchWithAuth<UserProfile>(
 *   'https://graph.microsoft.com/v1.0/me',
 *   token
 * )
 * ```
 */
const fetchWithAuth = async <T = any>(
  url: string,
  accessToken: string,
  options?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await axios({
      url,
      method: options?.method || 'GET',
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      data: options?.data,
      ...options,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message || 'API request failed')
    }
    throw error
  }
}

/**
 * Custom hook to fetch the authenticated user's profile from Microsoft Graph API
 *
 * @returns {UseQueryResult<UserProfile>} TanStack Query result with user profile data
 *
 * @example
 * ```tsx
 * const { data: profile, isLoading, error } = useUserProfile()
 *
 * if (isLoading) return <Spinner />
 * if (error) return <Error message={error.message} />
 *
 * return <div>Welcome, {profile.displayName}</div>
 * ```
 */
export const useUserProfile = () => {
  const { instance, accounts } = useMsal()

  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      if (!accounts[0]) {
        throw new Error('No account found')
      }
      const account = accounts[0]
      const response = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account,
      })
      return fetchWithAuth<UserProfile>(graphConfig.graphMeEndpoint, response.accessToken)
    },
    enabled: accounts.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Custom hook to fetch the authenticated user's profile photo from Microsoft Graph API
 *
 * @returns {UseQueryResult<string | null>} TanStack Query result with photo URL or null
 *
 * @example
 * ```tsx
 * const { data: photoUrl } = useUserPhoto()
 *
 * return photoUrl ? (
 *   <img src={photoUrl} alt="Profile" />
 * ) : (
 *   <Avatar>{initials}</Avatar>
 * )
 * ```
 */
export const useUserPhoto = () => {
  const { instance, accounts } = useMsal()

  return useQuery({
    queryKey: ['userPhoto'],
    queryFn: async () => {
      if (!accounts[0]) {
        throw new Error('No account found')
      }
      const account = accounts[0]
      const response = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account,
      })

      try {
        const photoResponse = await axios.get('https://graph.microsoft.com/v1.0/me/photo/$value', {
          headers: {
            Authorization: `Bearer ${response.accessToken}`,
          },
          responseType: 'blob',
        })

        return URL.createObjectURL(photoResponse.data)
      } catch (error) {
        console.warn('User photo not available:', error)
        return null
      }
    },
    enabled: accounts.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry if user has no photo
  })
}

/**
 * Generic hook for fetching data from any authenticated API endpoint
 *
 * @template T - The expected response data type
 * @param {string[]} queryKey - Unique identifier for the query cache
 * @param {string} endpoint - The API endpoint to fetch from
 * @param {string[]} [scopes=['User.Read']] - MSAL scopes required for the request
 * @returns {UseQueryResult<T>} TanStack Query result with typed data
 *
 * @example
 * ```tsx
 * interface CustomData { id: number; name: string }
 *
 * const { data } = useAuthenticatedQuery<CustomData>(
 *   ['customData'],
 *   '/api/custom-endpoint',
 *   ['User.Read', 'Mail.Read']
 * )
 * ```
 */
export const useAuthenticatedQuery = <T>(
  queryKey: string[],
  endpoint: string,
  scopes: string[] = ['User.Read']
) => {
  const { instance, accounts } = useMsal()

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accounts[0]) {
        throw new Error('No account found')
      }
      const account = accounts[0]
      const response = await instance.acquireTokenSilent({
        scopes,
        account,
      })
      return fetchWithAuth<T>(endpoint, response.accessToken)
    },
    enabled: accounts.length > 0,
  })
}

/**
 * Generic hook for authenticated mutations (POST, PUT, DELETE, PATCH)
 * Automatically invalidates queries on success
 *
 * @template TData - The expected response data type
 * @template TVariables - The mutation input data type
 * @param {string} endpoint - The API endpoint to mutate
 * @param {'POST' | 'PUT' | 'DELETE' | 'PATCH'} [method='POST'] - HTTP method
 * @param {string[]} [scopes=['User.Read']] - MSAL scopes required for the request
 * @returns {UseMutationResult<TData, Error, TVariables>} TanStack Query mutation result
 *
 * @example
 * ```tsx
 * interface UpdateData { name: string }
 * interface ResponseData { id: number; name: string }
 *
 * const mutation = useAuthenticatedMutation<ResponseData, UpdateData>(
 *   '/api/update',
 *   'PUT'
 * )
 *
 * mutation.mutate({ name: 'New Name' })
 * ```
 */
export const useAuthenticatedMutation = <TData, TVariables>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST',
  scopes: string[] = ['User.Read']
) => {
  const { instance, accounts } = useMsal()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: TVariables) => {
      if (!accounts[0]) {
        throw new Error('No account found')
      }
      const account = accounts[0]
      const response = await instance.acquireTokenSilent({
        scopes,
        account,
      })

      return fetchWithAuth<TData>(endpoint, response.accessToken, {
        method,
        data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries()
    },
  })
}

/**
 * Custom hook for fetching data from custom API endpoints
 * Uses a dynamic query key based on the endpoint
 *
 * @template T - The expected response data type
 * @param {string} endpoint - The custom API endpoint to fetch from
 * @returns {UseQueryResult<T>} TanStack Query result with typed data
 *
 * @example
 * ```tsx
 * interface Todo { id: number; title: string; completed: boolean }
 *
 * const { data: todos } = useCustomData<Todo[]>('/api/todos')
 * ```
 */
export const useCustomData = <T>(endpoint: string) => {
  const { instance, accounts } = useMsal()

  return useQuery({
    queryKey: ['customData', endpoint],
    queryFn: async () => {
      if (!accounts[0]) {
        throw new Error('No account found')
      }
      const account = accounts[0]
      const response = await instance.acquireTokenSilent({
        scopes: ['User.Read'],
        account,
      })

      return fetchWithAuth<T>(endpoint, response.accessToken)
    },
    enabled: accounts.length > 0,
  })
}
