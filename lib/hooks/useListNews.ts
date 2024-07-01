import { useQuery } from "@tanstack/react-query"
import { NewsArticle } from "../types/news"
import filter from "lodash/filter"

interface FetchNewsFilters {
  apiKey?: string
  q?: string
  from?: string
  to?: string
  sortBy?: string
}

interface FetchNewsResult {
  status: string
  message?: string
  totalResults: number
  articles: NewsArticle[]
}


const fetchNews = async (filters: FetchNewsFilters = {}): Promise<FetchNewsResult> => {
  const defaultFilters: FetchNewsFilters = {
    apiKey: '183daca270264bad86fc5b72972fb82a',
    sortBy: 'popularity',
  }

  const params: Record<string, any> = { ...defaultFilters, ...filters }
  const queryParams = new URLSearchParams(params).toString()
  const url = `https://newsapi.org/v2/everything?${queryParams}`
  const response = await fetch(url)
  const data = await response.json()

  return { ...data, articles: filter(data.articles, ({ title  }) => title !== '[Removed]' ) }
}

interface UseListNewsProps {
  filters?: FetchNewsFilters
}

export const useListNews = (props?:UseListNewsProps) => {
  const { filters } = props || {}
  const queryKey = JSON.stringify(filters)

  const onUseQuery = useQuery({ 
    queryKey: ["list-news", queryKey], 
    queryFn: () => fetchNews(filters),
  })

  return onUseQuery
}