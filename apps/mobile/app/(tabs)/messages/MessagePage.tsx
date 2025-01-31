import { View, Text } from 'react-native';
import { dateToString } from '../../../utils/helpers';
import { Link } from 'expo-router';
import { RouterOutputs } from 'api';
import { trpc } from '../../../utils/trpc';

const MessagePage = ({
  messages,
  refetch,
}: {
  messages: RouterOutputs['getMessagesForUser'];
  refetch: any;
}) => {
  const readMessage = trpc.setMessageRead.useMutation({
    onSettled() {
      refetch();
    },
  });

  return (
    <View className='px-4 pt-4'>
      {messages?.filter((message: any) => message.status !== 'deleted')
        .length == 0 ? (
        <Text className='pt-16 text-center text-xl font-bold text-white'>
          No messages, check back later.
        </Text>
      ) : (
        <View>
          {messages
            ?.filter((message: any) => message.status !== 'deleted')
            ?.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .map((message: any) => (
              <View key={message.id} className='border-b border-zinc-700 py-2'>
                <Link
                  href={`/messages/${message.id}`}
                  onPress={() => readMessage.mutate({ message_id: message.id })}
                >
                  <View className='flex w-full flex-row items-center justify-between gap-2 pb-2'>
                    <View className='flex flex-col'>
                      <Text className='text-xl text-white'>
                        {message.message.length < 32
                          ? message.message
                          : `${message.message.slice(0, 32)}...`}
                      </Text>
                      <Text className='pt-1 text-left text-xs font-light text-muted-foreground'>
                        {dateToString(message.created_at)}
                      </Text>
                    </View>
                    <View className='flex pr-2'>
                      {message.status === 'unread' && (
                        <View className='h-3 w-3 rounded-full bg-blue-700'></View>
                      )}
                    </View>
                  </View>
                </Link>
              </View>
            ))}
        </View>
      )}
    </View>
  );
};

export default MessagePage;
