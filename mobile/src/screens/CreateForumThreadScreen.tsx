// mobile/src/screens/CreateForumThreadScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import * as forumService from '../services/forumService';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadFile } from '../services/itemService';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainAppStackParamList } from '../navigation/types';

type CreateForumThreadScreenNavigationProp = StackNavigationProp<MainAppStackParamList, 'CreateForumThread'>;

interface Props {
  navigation: CreateForumThreadScreenNavigationProp;
}

const CreateForumThreadScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

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

  const handleCreate = async () => {
    setLoading(true);
    await forumService.createThread(title, content, undefined, selectedImages);
    setLoading(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Create New Thread</Text>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginVertical: 10 }}
        />
        <TextInput
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
          style={{ borderWidth: 1, borderColor: 'gray', padding: 5, marginBottom: 10, height: 150 }}
        />
        <TouchableOpacity onPress={handleCreate} style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center' }} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text style={{ color: 'white' }}>Create</Text>}
        </TouchableOpacity>
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
      </View>
    </SafeAreaView>
  );
};

export default CreateForumThreadScreen;
