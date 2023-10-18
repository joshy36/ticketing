import React, { useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { View, Text } from 'react-native';

const Search = () => {
  const [search, setSearch] = useState('');

  const updateSearch = (search: string) => {
    setSearch(search);
  };

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <Text>Search Page</Text>
      <SearchBar
        className="bg-black text-green-600"
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
      />
    </View>
  );
};

export default Search;
