import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  ScrollView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import Fontisto from '@expo/vector-icons/Fontisto';
import data from './data'; 
import "../global.css";

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 7000);
    return () => clearTimeout(timer);
  }, []);

if (isLoading) {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500">
      <Entypo name="aircraft" size={80} color="white" />
      <Text className="text-white text-3xl font-bold mt-2">Travelokal</Text>
      <ActivityIndicator size="large" color="#ffffff" className="mt-4" />
    </View>
  );
}


  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/736x/c3/d8/d0/c3d8d018363c14da207599ddfb51f702.jpg' }}
        resizeMode="cover"
        style={{ flex: 1, width: null, height: null }}
        className="bg-contain"
      >
      <View className="flex items-center mt-28">
        <Entypo name="aircraft" size={60} color="white" />
        <Text className="text-white text-5xl mt-5 font-bold">TRAVELOKAL</Text>
      </View>

        <View className="flex-1"/>

        <View className="w-full px-6 mb-10">
          <View className="mb-8">
            <Text className="text-left lg:text-center text-white text-xl">Plan your</Text>
            <Text className="text-left lg:text-center text-white text-3xl font-bold">Luxurious Vacations</Text>
          </View>
          <TouchableOpacity
            className="bg-blue-700 py-3 px-6 rounded-2xl w-full lg:w-52 self-center"
            onPress={() => navigation.navigate('Details')}>
            <Text className="text-white text-center font-bold">Explore</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const DetailsScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  // Filter data kategori aktif
  const filteredByCategory =
    activeCategory === 'All' ? Object.values(data).flat() : data[activeCategory] || [];

  // Filter data pencarian
  const displayedData = filteredByCategory.filter(
    (item, index, self) =>
      // Filter berdasarkan teks pencarian
      item.title.toLowerCase().includes(searchText.toLowerCase()) &&
      // Hilangkan duplikasi berdasarkan ID
      index === self.findIndex((i) => i.id === item.id)
  );

  return (
    <View className="flex-1 bg-gray-200 pt-12">
      {/* Header */}
      <View className="mt-3 px-4">
        <Text className="text-black text-2xl">Explore</Text>
        <Text className="text-black text-3xl font-extrabold">Indonesia</Text>
      </View>

      {/* Search Bar */}
      <View className="mt-4 px-4">
        <View className="flex-row items-center bg-white rounded-lg shadow-md p-2">
          <Ionicons name="search" size={20} color="gray" className="mr-2" />
          <TextInput
            placeholder="Search for a destination..."
            value={searchText}
            onChangeText={setSearchText}
            className="flex-1 text-black text-base"
          />
          {searchText !== '' && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="gray" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Buttons */}
      <View className="mt-4 mb-4">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="px-4"
        >
          <View className="flex-row">
            {['All', 'Hotels', 'Adventure', 'Beach', 'Mountain'].map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => {
                  setActiveCategory(category);
                  setSearchText(''); // Reset pencarian saat kategori diganti
                }}
                className={`py-2 px-4 rounded-3xl mr-2 ${
                  activeCategory === category ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <Text
                  className={`${
                    activeCategory === category ? 'text-white' : 'text-black'
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>


      {/* FlatList */}
      <FlatList
        data={displayedData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 12,
        }}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-lg shadow-md overflow-hidden"
            style={{
              flexBasis: '48%',
              marginBottom: 12,
            }}
            onPress={() => navigation.navigate('DetailCard', item)}
          >
            <Image
              source={item.image}
              className="w-full h-40"
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="text-lg font-bold text-black">{item.title}</Text>
              <Text className="text-gray-500 mt-0">{item.type}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-500 mt-4">
            No destinations found.
          </Text>
        )}
      />

      {/* Help Button */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AboutApp')}
        className="absolute top-12 right-4"
      >
        <Ionicons name="help-circle-outline" size={30} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

const DetailCardScreen = ({ route, navigation }) => {
  const { title, image, description, price, location } = route.params;
  const imageSource = typeof image === 'string' ? { uri: image } : image;

  // State untuk Modal
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="flex-1 bg-gray-200">
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: 40, 
          left: 16,
          backgroundColor: '#333',
          borderRadius: 25,
          padding: 10,
          zIndex: 10, 
        }}
      >
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>


      <Image source={imageSource} className="w-full h-64" resizeMode="cover" />
      <View className="flex-1 px-4 mt-4">
        <Text className="text-black text-2xl font-bold">{title}</Text>
        <Text className="text-gray-500 text-sm mt-2">📍 {location}</Text>
        <Text className="text-gray-500 text-sm mt-1">⭐ 4.5 (355 Reviews)</Text>
        <Text className="text-gray-500 text-sm mt-1">💰 Prices ${price}</Text>
        <Text className="text-gray-700 text-base mt-4">{description}</Text>
        <Text className="text-black text-xl font-bold mt-6">Facilities</Text>
        {/* Bagian Ikon */}
        <View className="flex-row justify-evenly mt-4">
          <View className="items-center">
            <Ionicons name="thermometer-outline" size={24} color="gray" />
            <Text className="text-gray-500 text-sm mt-2">Heater</Text>
          </View>
          <View className="items-center">
            <Ionicons name="restaurant-outline" size={24} color="gray" />
            <Text className="text-gray-500 text-sm mt-2">Dinner</Text>
          </View>
          <View className="items-center">
            <Ionicons name="wifi-outline" size={24} color="gray" />
            <Text className="text-gray-500 text-sm mt-2">Wifi</Text>
          </View>
        </View>

        {/* Tombol Explore Now */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-700 rounded-lg py-3 mt-4">
          <Text className="text-center text-white text-xl font-bold">Explore Now</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Popup */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/60 justify-center items-center">
          <View className="bg-white w-80 p-5 rounded-lg shadow-lg items-center">
            <Text className="text-xl font-bold text-black mb-2">
              Thank you for exploring!
            </Text>
            <Text className="text-gray-700 text-center mb-4">
              You are now one step closer to an unforgettable adventure.
            </Text>
            <Image
              source={require('../assets/images/travel.gif')}
              className="w-48 h-48 mb-4"
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-700 px-6 py-2 rounded-lg">
              <Text className="text-white font-bold text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AboutAppScreen = ({ navigation }) => (
  <View className="flex-1 justify-center items-center bg-white">
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        position: 'absolute',
        top: 40, 
        left: 16,
        backgroundColor: '#333',
        borderRadius: 25,
        padding: 10,
        zIndex: 10, 
      }}>
      <Ionicons name="arrow-back" size={30} color="white" />
    </TouchableOpacity>
    <AntDesign name="smileo" size={64} color="black" />
    <Text className="text-2xl  mt-4 font-bold">About Travelokal</Text>
    <Text className="text-gray-600 text-sm mt-1 font-normal">by Anfika Arifin</Text>
    <Text className="text-center text-gray-600 mt-4">
      Travelokal is your travel companion for discovering the best places to stay, 
      explore, and enjoy in your next vacation.
    </Text>
  </View>
);

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="DetailCard" component={DetailCardScreen} />
        <Stack.Screen name="AboutApp" component={AboutAppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
