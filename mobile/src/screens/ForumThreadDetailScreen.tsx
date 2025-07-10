// mobile/src/screens/ForumThreadDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import * as forumService from '../services/forumService';
import * as reportService from '../services/reportService';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadFile } from '../services/itemService';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { MainAppStackParamList } from '../navigation/types';

type ForumThreadDetailScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'ForumThreadDetail'>;
type ForumThreadDetailScreenRouteProp = RouteProp<MainAppStackParamList, 'ForumThreadDetail'>;

interface Props {
  navigation: ForumThreadDetailScreenNavigationProp;
  route: ForumThreadDetailScreenRouteProp;
}

const ForumThreadDetailScreen: React.FC<Props> = ({ route }) => {
  const { threadId } = route.params;
  const [thread, setThread] = useState<forumService.ForumThread | null>(null);
  const [posts, setPosts] = useState<forumService.ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const fetchThread = async () => {
      setLoading(true);
      const { thread, posts } = await forumService.getThreadById(threadId);
      setThread(thread);
      setPosts(posts);
      setLoading(false);
    };
    fetchThread();
  }, [threadId]);

  const handleSummarize = async () => {
    try {
      const { summary } = await forumService.summarizeThread(threadId);
      setSummary(summary);
    } catch (error) {
      Alert.alert('Error', 'Failed to summarize thread.');
    }
  };

  const handleImagePick = async () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 5 }, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('ImagePicker Error', response.errorMessage || 'An error occurred.');
      } else if (response.assets) {
        setUploadingImages(true);
        const uploadedUrls: string[] = [];
        for (const asset of response.assets) {
          if (asset.uri) {
            try {
              const uploadedFile = await uploadFile(asset, () => {}); // No progress tracking for now
              uploadedUrls.push(uploadedFile.file);
            } catch (error) {
              console.error('Failed to upload image:', error);
              Alert.alert('Upload Failed', 'Could not upload image.');
            }
          }
        }
        setSelectedImages(prev => [...prev, ...uploadedUrls]);
        setUploadingImages(false);
      }
    });
  };

  const handleReport = async (entityId: string, entityType: 'ForumThread' | 'ForumPost') => {
    Alert.prompt(
      'Report Content',
      'Please provide a reason for reporting this content.',
      async (reason) => {
        if (reason) {
          try {
            await reportService.createReport(entityType, entityId, reason);
            Alert.alert('Report Submitted', 'Thank you for your report. We will review it shortly.');
          } catch (error) {
            Alert.alert('Error', 'Failed to submit report.');
          }
        }
      }
    );
  };

  const handleReply = async () => {
    if (replyContent.trim() || selectedImages.length > 0) {
      try {
        const newPost = await forumService.addReply(threadId, replyContent, selectedImages);
        setPosts([...posts, newPost]);
        setReplyContent('');
        setSelectedImages([]);
      } catch (error) {
        Alert.alert('Error', 'Failed to add reply.');
      }
    }
  };

  const handleUpvote = async (postId: string) => {
    try {
      const updatedPost = await forumService.upvotePost(postId);
      setPosts(posts.map(p => p._id === postId ? updatedPost : p));
    } catch (error) {
      Alert.alert('Error', 'Failed to upvote post.');
    }
  };

  const handleAcceptAnswer = async (postId: string) => {
    try {
      const updatedPost = await forumService.acceptAnswer(threadId, postId);
      setPosts(posts.map(p => p._id === postId ? updatedPost : p));
    } catch (error) {
      Alert.alert('Error', 'Failed to accept answer.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator />
      ) : thread ? (
        <View style={{ padding: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{thread.title}</Text>
          <Text style={{ fontSize: 16, color: 'gray' }}>by {thread.author.firstName} {thread.author.lastName}</Text>
          <Text style={{ marginVertical: 10 }}>{thread.content}</Text>
          <TouchableOpacity onPress={() => handleReport(threadId, 'ForumThread')} style={{ backgroundColor: 'red', padding: 5, alignItems: 'center', marginTop: 5 }}>
            <Text style={{ color: 'white', fontSize: 12 }}>Report Thread</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSummarize} style={{ backgroundColor: 'purple', padding: 10, alignItems: 'center', marginVertical: 10 }}>
            <Text style={{ color: 'white' }}>Summarize Thread</Text>
          </TouchableOpacity>

          {summary ? (
            <View style={{ padding: 10, backgroundColor: 'lightyellow', marginVertical: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Summary:</Text>
              <Text>{summary}</Text>
            </View>
          ) : null}

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Replies</Text>
          <FlatList
            data={posts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: 'lightgray' }}>
                <Text>{item.content}</Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>by {item.author.firstName} {item.author.lastName} - Upvotes: {item.upvotes}</Text>
                {item.images && item.images.length > 0 && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                    {item.images.map((image, index) => (
                      <Image key={index} source={{ uri: `http://localhost:3000${image}` }} style={{ width: 50, height: 50, margin: 5 }} />
                    ))}
                  </View>
                )}
                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                  <TouchableOpacity onPress={() => handleUpvote(item._id)} style={{ backgroundColor: 'green', padding: 5, marginRight: 10 }}>
                    <Text style={{ color: 'white' }}>Upvote</Text>
                  </TouchableOpacity>
                  {thread.author._id === item.author._id && ( // Only thread author can accept answer
                    <TouchableOpacity onPress={() => handleAcceptAnswer(item._id)} style={{ backgroundColor: 'blue', padding: 5 }}>
                      <Text style={{ color: 'white' }}>{item.isAcceptedAnswer ? 'Accepted' : 'Accept Answer'}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => handleReport(item._id, 'ForumPost')} style={{ backgroundColor: 'red', padding: 5, marginLeft: 10 }}>
                    <Text style={{ color: 'white', fontSize: 12 }}>Report Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <TextInput
            placeholder="Add a reply..."
            value={replyContent}
            onChangeText={setReplyContent}
            multiline
            style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginVertical: 10, height: 80 }}
          />
          {selectedImages.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
              {selectedImages.map((image, index) => (
                <Image key={index} source={{ uri: `http://localhost:3000${image}` }} style={{ width: 50, height: 50, margin: 5 }} />
              ))}
            </View>
          )}
          <TouchableOpacity onPress={handleImagePick} style={{ backgroundColor: 'green', padding: 10, alignItems: 'center', marginBottom: 10 }} disabled={uploadingImages}>
            {uploadingImages ? <ActivityIndicator /> : <Text style={{ color: 'white' }}>Add Image</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReply} style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>Post Reply</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Thread not found</Text>
      )}
    </SafeAreaView>
  );
