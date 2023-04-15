//#region Imports
import {initializeApp} from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    updateEmail,
    reauthenticateWithCredential} from "firebase/auth";
import {collection, doc, getDoc, getDocs, getFirestore, setDoc} from 'firebase/firestore/lite';
//#endregion

//#region Initialization
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyB5MS581oLJ-ruKvabtoDCinZv1NWgQrNs",
    authDomain: "restaurant-app-ge.firebaseapp.com",
    projectId: "restaurant-app-ge",
    storageBucket: "restaurant-app-ge.appspot.com",
    messagingSenderId: "740579522082",
    appId: "1:740579522082:web:957cd0ba3d5b27e39cbc7b",
    measurementId: "G-6NV22X0T27"
};
// const firebaseConfig = {
//     apiKey: "AIzaSyB5MS581oLJ-ruKvabtoDCinZv1NWgQrNs",
//     authDomain: "localhost",
//     projectId: "restaurant-app-ge",
//     storageBucket: "restaurant-app-ge.appspot.com",
//     messagingSenderId: "740579522082",
//     appId: "1:740579522082:web:957cd0ba3d5b27e39cbc7b",
//     measurementId: "G-6NV22X0T27"
// };

const app= initializeApp(firebaseConfig);

//#endregion

//#region Firebase Auth
const auth = getAuth();
let user;

/**
 * Sign up with email and password
 * @param email - email address
 * @param password - password
 */
export const signUp = (email, password)=>{
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials =>{
            user = userCredentials.user
            console.log(user.email + " just signed up.")
        })
        .catch(error => alert(error.message))
}
/**
 * Sign in with email and password
 * @param email - email address
 * @param password - password
 */
export const signIn = (email, password)=>{
    signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials =>{
            user = userCredentials.user
            console.log(user.email + " just signed in.")
        })
        .catch(error => alert(error.message))
}
/**
 * Sign out the current user
 */
export const signOut = ()=>{
    auth.signOut()
        .then(() => {
            user = null
            console.log("User signed out.")
        })
        .catch(error => alert(error.message))
}
/**
 * Get the current user (local)
 * @returns {*} - user object
 */
export const getUser = ()=>{
    return user
}
/**
 * Subscribe to user login/out event and call the callback function
 * @param callback {function} - function to be called when user logs in
 * @returns {Unsubscribe}
 */
export const subscribeToLogInEvent = (callback)=>{
    return auth.onAuthStateChanged(callback)
}
/**
 * Reset password. Send a reset password email to the user
 * @param email - email address
 * @param resetPasswordEvent - callback function. Must accept a boolean parameter.
 */
export const resetPassword = (email, resetPasswordEvent)=>{
    console.log("Reset password for " + email);
    sendPasswordResetEmail(auth, email)
        .then(() => {
            console.log("Reset password email sent to " + email)
            resetPasswordEvent(true);
        })
        .catch((error) => {
            console.log("Error sending reset password email to " + email)
            resetPasswordEvent(false);
            throw error;
        });
}
/**
 * Update password
 * @param oldpassword - old password
 * @param password - new password
 * @param changePasswordEvent - callback function. Must accept a boolean parameter.
 */
export const updateUserPassword = (oldpassword, password, changePasswordEvent)=>{
    reauthenticate(oldpassword, (success)=>{
        if(success){
            console.log("Reauthentication successful.")
            updatePassword(user, password)
                .then(() => {
                    console.log("Password updated.")
                    changePasswordEvent(true)
                })
                .catch((error) => {
                    console.log(error.log);
                    changePasswordEvent(false)
                });
        }
        else{
            changePasswordEvent(false)
        }
    })
}
/**
 * Check if the user is verified.
 * @returns {boolean}
 */
export const checkIfUserIsVerified = ()=>{
    return user.emailVerified;
}
/**
 * Send a verification email to the user
 * @param verificationEmailEVent - callback function. Must accept a boolean parameter.
 */
export const sendVerificationEmail = (verificationEmailEVent)=>{
    sendEmailVerification(user)
        .then(() => {
            verificationEmailEVent(true)
        })
        .catch((error) => {
            console.log(error.log);
            verificationEmailEVent(false)
        });
}
/**
 * Update email
 * @param oldpassword - old password
 * @param email - new email
 * @param updateEmailEvent - callback function. Must accept a boolean parameter.
 */
export const updateUserEmail = (oldpassword, email, updateEmailEvent)=>{
    reauthenticate(oldpassword, (success)=>{
        if(success){
            console.log("Reauthentication successful.")
            updateEmail(user, email)
                .then(() => {
                    console.log("Email updated.")
                    updateEmailEvent(true)
                })
                .catch((error) => {
                    console.log(error.log);
                    updateEmailEvent(false)
                });
        }
        else{
            updateEmailEvent(false)
        }
    })
}
/**
 * Reauthenticate the user. Use this before updating email or password.
 * @param password - password
 * @param reauthenticateEvent - callback function. Must accept a boolean parameter.
 */
export const reauthenticate = (password, reauthenticateEvent)=>{
    const credential = auth.EmailAuthProvider.credential(user.email, password)
    reauthenticateWithCredential(user, credential)
        .then(() => {
            reauthenticateEvent(true)
        })
        .catch((error) => {
            console.log(error.log);
            reauthenticateEvent(false)
        });
}
//#endregion

//#region Firebase Database
const db = getFirestore(app);

let RestaurantStorage = null;
let FullRestaurantStorage = {};

//#region Restaurant
const FoodCategories = [
    //Asian, Breakfast, Fast food, Chicken, Desserts, Fish, Healthy, Diet, Hot-dog, Mexican, Indian, European, Italian, Japanese, Alcohol, Soup, Sweets
    {
        MainImage: "https://www.aucklandairport.co.nz/-/media/Images/Traveller/Retail/Eat-and-Relax/Restaurant-main-images/McDonalds5.ashx",
        Type: "Fast Food",
    },
    {
        MainImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Khinkali_551.jpg/1200px-Khinkali_551.jpg",
        Type: "Georgian Cuisine",
    },
    {
        MainImage: "https://bridgecafecheltenham.co.uk/wp-content/uploads/2019/05/coffee.jpg",
        Type: "Cafe",
    },
    {
        MainImage: "https://www.wapititravel.com/blog/wp-content/uploads/2020/01/sashimi__healthy_japan_food.jpg",
        Type: "Asian",
    },
    {
        MainImage: "https://d.newsweek.com/en/full/1312719/breakfast-food-pancakes-stock-getty.jpg",
        Type: "Breakfast",
    },
    {
        MainImage: "https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/bnyisqli4tyobvs3iikb",
        Type: "Pizza",
    },
    {
        MainImage: "https://wallsdesk.com/wp-content/uploads/2016/11/Fried-Chicken-for-desktop.jpg",
        Type: "Chicken",
    },
    {
        MainImage: "https://i1.wp.com/culinarylore.com/wp-content/uploads/2018/05/chocolate-cake-dessert.jpg?resize=480%2C316&ssl=1",
        Type: "Desserts",
    },
    {
        MainImage: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/91b1a584826873.5d6906eb2a3d5.jpg",
        Type: "Fish",
    },
    {
        MainImage: "http://physicalsolutionsli.com/wp-content/uploads/2020/02/heart-diet-1024x680.jpg",
        Type: "Healthy",
    },
    {
        MainImage: "https://www.drweil.com/wp-content/uploads/2019/02/Macrobiotic-Diet-2-938448852.jpg",
        Type: "Diet",
    },
    {
        MainImage: "https://trueactivist.com/wp-content/uploads/2015/07/hotdog2.jpg",
        Type: "Hot dog",
    },
    {
        MainImage: "http://3.bp.blogspot.com/-YnIC50Thwjo/UVGXaV9pIbI/AAAAAAAAg7w/1gSgAj0G7_s/s1600/Mexican+Food+-+Resize.jpg",
        Type: "Mexican",
    },
    {
        MainImage: "https://www.washingtonpost.com/rf/image_1484w/2010-2019/WashingtonPost/2015/03/04/Interactivity/Images/iStock_000050497740_Full.jpg?t=20170517",
        Type: "Indian",
    },
    {
        MainImage: "https://www.aspirantsg.com/wp-content/uploads/2016/09/Wiener-Schnitzel-AspirantSG.jpg",
        Type: "European",
    },
    {
        MainImage: "https://i.huffpost.com/gen/964952/images/o-ITALIAN-FOOD-SURVEY-facebook.jpg",
        Type: "Italian",
    },
    {
        MainImage: "https://www.zastavki.com/pictures/1600x1200/2009/Food_Seafood_Japanese_Cuisine_Sushi_012022_.jpg",
        Type: "Japanese",
    },
    {
        MainImage: "https://cff2.earth.com/uploads/2019/04/03121800/Alcohol-induced-brain-damage-continues-even-after-quitting-drinking.jpg",
        Type: "Alcohol",
    },
    {
        MainImage: "https://www.tasteofhome.com/wp-content/uploads/2021/01/Holy-Moly-Potato-Soup_EXPS_TOHSODA21_180290_E12_10_4b-2.jpg",
        Type: "Soup",
    },
];

/**
 * Get all restaurants
 * @returns {Promise<DocumentData[]>}
 */
export const getRestaurants = async () => {
    if (RestaurantStorage !== null) {
        return RestaurantStorage;
    }
    console.log("Getting restaurants from the online database");
    const restaurantsCol = collection(db, 'Restaurants');
    const restaurantSnapshot = await getDocs(restaurantsCol);
    RestaurantStorage = restaurantSnapshot.docs.map(doc => doc.data());
    return RestaurantStorage;
}

/**
 * Get a restaurant by id
 * @param restaurantId
 * @returns {Promise<DocumentData>}
 */
export const getRestaurant = async (restaurantId) => {
    if (FullRestaurantStorage[restaurantId] !== undefined) {
        return FullRestaurantStorage[restaurantId];
    }
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const restaurantSnapshot = await getDoc(restaurantRef);
    if (restaurantSnapshot.exists()) {
        console.log("Restaurant data:", restaurantSnapshot.data()["MainImage"]);
        FullRestaurantStorage[restaurantId] = restaurantSnapshot.data();
        return restaurantSnapshot.data();
    } else {
        console.log("No such document!");
    }
}
/**
 * Get Restaurants by name filter
 * @param restaurantName
 * @returns {Promise<DocumentData[]>}
 */
export const getRestaurantByNameFilter = async (restaurantName) => {
    if(RestaurantStorage === null){
        await getRestaurants();
    }
    return RestaurantStorage.filter(restaurant => restaurant["Title"].includes(restaurantName));
}

/**
 * Get Restaurants by category filter
 * @param restaurantCategory
 * @returns {Promise<DocumentData[]>}
 */
export const getRestaurantByCategoryFilter = async (restaurantCategory) => {
    if(RestaurantStorage === null){
        await getRestaurants();
    }
    return RestaurantStorage.filter(restaurant => restaurant["Genre"].includes(restaurantCategory));
}
export const getRestaurantByTagFilter = async (restaurantTags) => {
    if(RestaurantStorage === null){
        await getRestaurants();
    }
    return RestaurantStorage.filter(restaurant => restaurant["Tags"].includes(restaurantTags));
}
/**
 * Gets all categories. In the future, it'll get data from the server time to time.
 * @returns {[{MainImage: string, Type: string},{MainImage: string, Type: string},{MainImage: string, Type: string},{MainImage: string, Type: string},{MainImage: string, Type: string},null,null,null,null,null,null,null,null,null,null,null,null,null,null]}
 */
export const getCategoriesList = () => {
    return FoodCategories;
}
/**
 * Set a restaurant to a value by id (PRODUCTION ONLY)
 * @param restaurantId
 * @param restaurantData
 * @returns {Promise<void>}
 */
export const setRestaurant = async (restaurantId, restaurantData)=>{
    const restaurantRef = doc(db, "Restaurants", restaurantId);
    const RestaurantStorage = await getDoc(restaurantRef);
    if (RestaurantStorage.exists()) {
        //console.log("Restaurant data:", RestaurantStorage.data());
    } else {
        console.log("No such document!");
    }
    await setDoc(restaurantRef, restaurantData, {merge: true});
}

export const setRestaurantDataFull = async (restaurantId, restaurantData)=>{
    const restaurantRef = doc(db, "RestaurantsFull", restaurantId);
    const RestaurantStorage = await getDoc(restaurantRef);
    if (RestaurantStorage.exists()) {
        //console.log("Restaurant data:", RestaurantStorage.data());
    } else {
        console.log("No such document!");
    }
    await setDoc(restaurantRef, restaurantData, {merge: true});
}

/**
 * Get all Tags of a restaurant. NOTE: THIS RETURNS TAGS, DESPITE THE NAME
 * @param restaurantTitle
 * @returns {Promise<any>}
 */
export const getRestaurantCategories = async (restaurantTitle) => {
    if(RestaurantStorage === null){
        await getRestaurants();
    }
    RestaurantStorage.forEach(restaurant => {
        if (restaurant["Title"] === restaurantTitle) {
            return restaurant["Tags"];
        }
    });
    console.log("Restaurant not found. If a Restaurant was just uploaded, call the 'Refresh' function.");
    return null;
}
/**
 * Get all dishes of a category
 * @param restaurantTitle
 * @param categoryId
 * @returns {Promise<*>}
 */
export const getCategoryDishes = async (restaurantTitle, categoryId) => {
    getRestaurant(restaurantTitle).then(restaurant => {
        return restaurant["FoodCategories"][categoryId]["dishes"];
    });
    console.log("Category not found. If a Category was just uploaded, call the 'Refresh' function.");
    return null;
}
/**
 * Get a dish by id
 * @param restaurantId
 * @param categoryId
 * @param dishId
 * @returns {Promise<*>}
 */
export const getDish = async (restaurantId, categoryId, dishId) => {
    getRestaurant(restaurantId).then(restaurant => {
        return restaurant["FoodCategories"][categoryId]["dishes"][dishId];
    });
    console.log("Dish not found. If a Dish was just uploaded, call the 'Refresh' function.");
    return null;
}
//#endregion

//#region User
/**
 * UNIMPLEMENTED - Get all users
 * @param userId
 * @returns {Promise<DocumentData>}
 */
export const getUserData = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
        console.log("User data:", userSnapshot.data());
        return userSnapshot.data();
    } else {
        console.log("No such document!");
    }
}
/**
 * UNIMPLEMENTED - Set a user to a value by id (PRODUCTION ONLY)
 * @param userId
 * @param userData
 * @returns {Promise<void>}
 */
export const setUserData = async (userId, userData)=>{
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
        console.log("User data:", userSnapshot.data());
    } else {
        console.log("No such document!");
    }
    await setDoc(userRef, userData, {merge: true});
}
/**
 * UNIMPLEMENTED - Create a user by id
 * @param userId
 * @param userData
 * @returns {Promise<void>}„
 */
export const createUser = async (userId, userData)=>{
    const userRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
        console.log("User data:", userSnapshot.data());
    } else {
        console.log("No such document! Creating new user...");
        await setDoc(userRef, userData);
    }
}

//#endregion
//#endregion