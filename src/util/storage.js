import AsyncStorage from '@react-native-community/async-storage';


export async function setItem(key, value) {
    try {
        return await AsyncStorage.setItem(key, value);
    } catch (err) {
        // saving error
        console.log(err);
    }
}

export async function getItem(key) {
    try {
        return Promise.resolve(await AsyncStorage.getItem(key));
    } catch (err) {
        // error reading value
        console.log(err);
    }
}
