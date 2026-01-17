import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const ChatDetailScreen = () => {
    return (
        <SafeAreaView className='flex-1 bg-background dark:bg-background-dark'>
            <Text className='text-foreground dark:text-foreground-dark'>ChatDetailScreen</Text>
        </SafeAreaView>
    )
}

export default ChatDetailScreen