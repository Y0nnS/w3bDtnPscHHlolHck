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
  Dimensions,
  useWindowDimensions,
  component,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
    const timer = setTimeout(() => setIsLoading(false), 4000); // Loading selama 4 detik
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
        source={require('../assets/images/bg.jpg')}
        resizeMode="cover"
        style={{ flex: 1, width: '100%', height: '100%' }}
      >
        <View className="flex items-center mt-28">
          <Entypo name="aircraft" size={60} color="white" />
          <Text className="text-white text-5xl mt-5 font-bold">TRAVELOKAL</Text>
        </View>

        <View className="flex-1 lg:hidden" />

        <View className="w-full px-6 mb-10 lg:top-40">
          <View className="mb-8">
            <Text className="text-left sm:text-center text-white text-xl">Plan your</Text>
            <Text className="text-left sm:text-center text-white text-3xl font-bold">Luxurious Vacations</Text>
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
  const { width } = useWindowDimensions(); // Mendapatkan lebar layar

  // Filter data kategori aktif
  const filteredByCategory =
    activeCategory === 'All' ? Object.values(data).flat() : data[activeCategory] || [];

  // Filter data pencarian
  const displayedData = filteredByCategory.filter(
    (item, index, self) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) &&
      index === self.findIndex((i) => i.id === item.id)
  );

  // Menentukan jumlah kolom berdasarkan lebar layar
  const numColumns = width > 600 ? 3 : 2; // Lebih dari 600px akan menampilkan 3 kolom, jika tidak 2 kolom

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          <View className="flex-row">
            {['All', 'Hotels', 'Adventure', 'Beach', 'Mountain'].map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => {
                  setActiveCategory(category);
                  setSearchText('');
                }}
                className={`py-2 px-4 rounded-3xl mr-2 ${
                  activeCategory === category ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                <Text className={`${activeCategory === category ? 'text-white' : 'text-black'}`}>
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
        numColumns={numColumns} // Menggunakan jumlah kolom yang sesuai dengan lebar layar
        contentContainerStyle={{
          paddingVertical: 16,
          paddingHorizontal: 12,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="bg-white rounded-lg shadow-md overflow-hidden"
            style={{
              width: `${100 / numColumns - 2}%`, 
              marginBottom: 12,
            }}
            onPress={() => navigation.navigate('DetailCard', item)}>
            <Image
              source={item.image}
              style={{
                width: '100%',
                height: 200,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
              resizeMode="cover"
            />
            <View className="p-4">
              <Text className="text-lg font-bold text-black">{item.title}</Text>
              <Text className="text-gray-500">{item.type}</Text>
            
              {/* Tambahkan elemen rating di bawah */}
              <View className="flex-row items-center mt-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <Text
                    key={index}
                    className={index < item.rating ? "text-yellow-500" : "text-gray-300"}>
                    ★
                  </Text>
                ))}
                <Text className="ml-2 text-gray-600 text-sm">({item.ratingCount})</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text className="text-center text-gray-500 mt-4">No destinations found.</Text>
        )}
      />
      {/* Help Button */}
      <TouchableOpacity onPress={() => navigation.navigate('AboutApp')} className="absolute top-12 right-4">
        <Ionicons name="help-circle-outline" size={30} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

// DETAIL CARD SCREEN
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

      {/* Image Section */}
      <View className="hidden md:flex md:justify-center sm:items-center sm:h-80">
        <Image
          source={imageSource}
          className="rounded-lg sm:w-1/2 sm:h-40"
          resizeMode="cover"
        />
      </View>

      {/* Mobile Image */}
      <Image source={imageSource} className="w-full h-64 md:hidden" resizeMode="cover" />

      {/* Content Section */}
      <View className="flex-1 px-4 mt-4 md:mt-14">
        <Text className="text-black text-2xl font-bold">{title}</Text>
        <Text className="text-gray-500 text-sm mt-2">📍 {location}</Text>
        <Text className="text-gray-500 text-sm mt-1">⭐ 4.5 (355 Reviews)</Text>
        <Text className="text-gray-500 text-sm mt-1">💰 Prices ${price}</Text>
        <Text className="text-gray-700 text-base mt-4">{description}</Text>
        <Text className="text-black text-xl font-bold mt-6">Facilities</Text>

        {/* Facilities Section */}
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

        {/* Explore Now Button */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="bg-blue-700 rounded-lg py-3 mt-4">
          <Text className="text-center text-white text-xl font-bold">Explore Now</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Popup */}
      <Modal visible={modalVisible} animationType="fade" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 bg-black/60 justify-center items-center">
          {/* Model Container */}
          <View className="bg-white max-w-md w-full p-5 rounded-lg shadow-lg items-center">
            {/* Title Popup */}
            <Text className="text-xl font-bold text-black mb-2">
              Thank you for exploring!
            </Text>
            <Text className="text-gray-700 text-center mb-4">
              You are now one step closer to an unforgettable adventure.
            </Text>
            {/* GIF Image */}
            <Image
              source={require('../assets/images/travel.gif')}
              className="w-full max-w-[12rem] max-h-48 object-contain mb-4"
              resizeMode="contain"
            />
            {/* Close Button */}
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


// PAGE ABOUT
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
    <Entypo name="aircraft" size={80} color="#333" />
    <Text className="text-2xl  mt-4 font-bold text-gray-700">About Travelokal</Text>
    <Text className="text-gray-600 text-sm mt-1 font-normal">by Anfika Arifin</Text>
    <Text className="text-center text-gray-600 mt-4">
      Travelokal is your travel companion for discovering the best places to stay, 
      explore, and enjoy in your next vacation.
    </Text>
  </View>
);



// STACK NAVIGATOR ( PINDAH HALAMAN )
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator untuk layar utama
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Sembunyikan header default pada tab
        tabBarStyle:
          route.name === 'Home' && route.params?.isLoading === true
            ? { display: 'none' } // Sembunyikan Tab Bar jika masih loading
            : { display: 'flex' }, // Tampilkan Tab Bar setelah selesai loading
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Details') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ isLoading: true }} />
      <Tab.Screen name="Details" component={DetailsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// Stack Navigator untuk navigasi global
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Masukkan Tab Navigator sebagai layar utama */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="DetailCard" component={DetailCardScreen} />
        <Stack.Screen name="AboutApp" component={AboutAppScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const ProfileScreen = () => (
  <View className="flex-1 justify-center items-center bg-white">
    <Ionicons name="person-circle-outline" size={80} color="gray" />
    <Text className="text-2xl mt-4 font-bold">Your Profile</Text>
    <Text className="text-gray-600 text-sm mt-2">Welcome to your profile!</Text>
  </View>
);
export default App;
