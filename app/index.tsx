import * as React from 'react';
import { FlatList, KeyboardAvoidingView, Linking, Platform, View } from 'react-native';
import debounce from 'lodash/debounce'
import { Input } from '~/components/ui/input'
import { Text } from '~/components/ui/text'
import { useListNews } from '~/lib/hooks/useListNews'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Loader } from '~/lib/icons/Loader';
import { MOCK_RESPONSE } from '~/lib/mocks'

const DEFAULT_SEARCH = ''

export default function Screen() {
  const [inputValue, setInputValue] = React.useState(DEFAULT_SEARCH)
  const [search, setSearch] = React.useState(DEFAULT_SEARCH)
  
  const { isLoading, data } = useListNews({ filters: { q: search } })
  const { articles, status, message } = data || {}

  const debounceSetSearch = React.useCallback(debounce(setSearch, 500), [])

  const onChangeText = (value: string) => {
    setInputValue(value)
    debounceSetSearch(value)
  }

  const onLinkPress = (url: string) => {
    if (url) Linking.openURL(url)
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className='flex-col flex-1 gap-5 p-6 bg-secondary/30'
    >
      <Input
        value={inputValue}
        onChangeText={onChangeText}
        placeholder='Start searching...'
        autoCapitalize='none'
    />
      {isLoading ? (
        <Loader className='color-slate-400 animate-spin mx-auto' />
      ) : status === 'error' ? (
        <Card className="p-3">
          <Text className="color-slate-500">{message}</Text>
        </Card>
      ) : !articles?.length ? (
        <Text className='mx-auto mt-14 text-lg font-semibold text-slate-400'>No results</Text>
      ) : (
        <View className='max-h-[85%]'>
          <FlatList
            data={articles || []}
            keyExtractor={item => item.title}
            renderItem={({ item }) => (
              <Button
                variant='outline'
                className='py-2 mx-3 bg-inherit border-0 rounded-none border-b-2 border-slate-200 border-solid'
                onPress={() => onLinkPress(item.url)}
              >
                <Text>{item.title}</Text>
              </Button>
            )}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
