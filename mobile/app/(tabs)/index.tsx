import { Text, ScrollView } from 'react-native'

const ChatsScreen = () => {
    return (
        <ScrollView
            className='flex-1 bg-background dark:bg-background-dark'
            contentInsetAdjustmentBehavior='automatic'
        >
            <Text className='text-foreground dark:text-foreground-dark p-4'>Chats</Text>
        </ScrollView>
    )
}

export default ChatsScreen