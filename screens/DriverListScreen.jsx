
import React,{useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    FlatList,
    View,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity, ImageBackground
} from 'react-native';

import {Driver} from "../components/DriverCard";
import axios from "axios";
import SearchComponent from "../components/Search";


export const  DriverListScreen =({navigation})=> {
    const [isLoading,setIsLoading]=React.useState(true);
    const [drivers, setDrivers] = React.useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchDrivers =() =>{
        setIsLoading(true);
        axios
            .get('http://192.168.1.32:8000/api/drivers/search/')
            .then(response => {
                // Access the drivers array from the response data
                const fetchedDrivers = response.data.drivers;
                setDrivers(fetchedDrivers);
                setFilteredDrivers(fetchedDrivers);
            })
            .catch(err => {
                console.log(err);
                alert('Error GET drivers');
            }).finally(()=>{
            setIsLoading(false);
        });

    }
    useEffect(fetchDrivers,[]);

    const handleSearch = (searchTerm) => {
        const searchTermLowerCase = searchTerm.toLowerCase();
        const filtered = drivers.filter((driver) =>
            driver.full_name.toLowerCase().includes(searchTermLowerCase)
        );
        setFilteredDrivers(filtered);
    };


    if(isLoading){
        return <View style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
        }}>
            <ActivityIndicator size="large"/>
            <Text>Загружается..</Text>

        </View>
    }


    return (
        <ImageBackground source={{uri:'https://www.creativefabrica.com/wp-content/uploads/2022/11/25/Car-Insurance-icon-Graphics-48467473-1-1-580x387.jpg'}}
                         style={styles.backgroundImage}
                         onError={(error) => console.error('Image load error:', error.nativeEvent.error)}>

        <View>

                <SearchComponent onSearch={handleSearch} />
                <FlatList

                    refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchDrivers}/>}
                    data = {filteredDrivers}
                    renderItem={({item}) => (
                        <TouchableOpacity onPress={()=>navigation.navigate('DriverScreen',{id:item.id, title:item.title})}>
                            <Driver full_name={item.full_name} passport_number = {item.passport_number} minioImageUrl = {item.image}/>
                        </TouchableOpacity>
                    )}
                />

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch' or 'contain'
        justifyContent: 'center',
        alignItems: 'center',

    }
});