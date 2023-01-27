import React from 'react';
import tw from 'twrnc';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MainSafeAreaView({ style, children }) {
  return <SafeAreaView style={tw.style('bg-black h-full', style)}>{children}</SafeAreaView>;
}
