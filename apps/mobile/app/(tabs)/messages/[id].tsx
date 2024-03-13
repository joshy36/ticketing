import { MessagesContext } from './messagesProvider';
import { useContext, useState } from 'react';
import GroupCard from './GroupCard';
import { ChevronLeft, Info } from 'lucide-react';
import RenderMessages from './RenderMessages';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
import ChatProfileCard from './ChatProfileCard';
import { trpc } from '../../../utils/trpc';
import Link from 'next/link';
import OrgCard from './OrgCard';
import RenderMessagesOrg from './RenderMessagesOrg';
import {
  TextInput,
  TouchableOpacity,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Home() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');

  const handleInputChange = (input: string) => {
    setMessage(input);
  };

  const handleSubmit = async () => {
    sendChatMessage.mutate({
      chat_id: id! as string,
      content: message,
    });
    setMessage('');
  };

  const sendChatMessage = trpc.sendChatMessage.useMutation({
    onSettled(data, error) {
      if (error) {
        // console.error('Error sending message:', error);
      } else if (data) {
        // console.log('Message sent:', data);
      }
    },
  });

  const { userProfile, chats } = useContext(MessagesContext);

  const currentChatDetails = chats?.chats?.find(
    (chat) => chat.id === (id! as string)
  );

  const getRandomUserFromChat = () => {
    return currentChatDetails?.chat_members.find(
      (user) => user.user_id != userProfile?.id
    )?.user_profiles!;
  };

  return (
    <View className="flex-1 bg-black flex-col">
      {/* <View className='relative top-0 flex w-full flex-row items-center justify-between px-4'>
          <Button className='lg:hidden' variant='ghost' asChild>
            <Link href={`/messages`}>
              <ChevronLeft />
            </Link>
          </Button>
          {currentChatDetails?.chat_type === 'dm' && (
            <ChatProfileCard
              userProfile={getRandomUserFromChat()}
              mostRecentMessage={null}
            />
          )}
          {currentChatDetails?.chat_type === 'group' && (
            <GroupCard
              userProfile={userProfile!}
              chatMembers={currentChatDetails?.chat_members.map(
                (member) => member.user_profiles!,
              )}
              mostRecentMessage={null}
            />
          )}
          {currentChatDetails?.chat_type === 'organization' && (
            <OrgCard
              artist={
                currentChatDetails?.chat_members.find(
                  (member) => member.artists,
                )?.artists
              }
              venue={
                currentChatDetails?.chat_members.find((member) => member.venues)
                  ?.venues
              }
              mostRecentMessage={null}
            />
          )}
          <Button asChild variant='ghost'>
            <Link href={`/messages/${params.id}/info`}>
              <Info />
            </Link>
          </Button>
        </View> */}

      <View className="flex-1 flex-col overflow-hidden pb-2">
        {currentChatDetails?.chat_type !== 'organization' && (
          <RenderMessages userProfile={userProfile!} />
        )}
        {currentChatDetails?.chat_type === 'organization' && (
          <RenderMessagesOrg
            artist={
              currentChatDetails?.chat_members.find((member) => member.artists)
                ?.artists
            }
            venue={
              currentChatDetails?.chat_members.find((member) => member.venues)
                ?.venues
            }
          />
        )}
      </View>
      {currentChatDetails?.chat_type !== 'organization' && (
        <KeyboardAvoidingView
          keyboardVerticalOffset={100}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="px-2 flex w-full items-center flex-row gap-2 bg-black backdrop-blur-md"
        >
          <TextInput
            className="mb-3 rounded-full flex-1 py-3 px-6 border border-zinc-800  text-muted-foreground items-center"
            placeholder="Message..."
            placeholderTextColor="#6B7280"
            onChangeText={handleInputChange}
            value={message}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={message.length === 0}
            className={`bg-white rounded-full px-4 py-3 mb-3 ${
              message.length === 0 ? 'opacity-50' : ''
            }`}
          >
            <Text className="font-semibold">Send</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
