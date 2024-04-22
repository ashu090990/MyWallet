import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, interpolate, useAnimatedReaction, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import * as Localization from 'expo-localization';
import translate from "./components/i18n/translate";

const details = () => {
    const [currLang, setCurrLang] = useState('en');
    const params = useLocalSearchParams();
    const isRefreshing = useSharedValue(0);
    const [isShow, setIsShow] = useState(false);
    const [btntxt, setBtnTxt] = useState("Animate");

    useAnimatedReaction(() => isShow, (current, previous) => {
        if (current == true) {
            isRefreshing.value = 1
        } else if (previous != null) {
            isRefreshing.value = 0
        }
    });

    const animatedStyles = useAnimatedStyle(() => {
        const rotateValue = interpolate(isRefreshing.value, [0, 1], [0, 360]);
        return rotateValue > 0 ? {
            transform: [
                {
                    rotate: withRepeat(
                        withTiming(`${rotateValue}deg`, { duration: 600, easing: Easing.linear }),
                        -1,
                        false
                    ),
                },
            ],
        } : {
            transform: [
                {
                    rotate: withTiming(`${rotateValue}deg`, { easing: Easing.linear, duration: 0 }),
                },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Details Screen</Text>
            </View>
            <View style={styles.cardDetails}>
                <Text style={styles.text}>
                    {translate.t('welcome')} {translate.t('name')}
                </Text>
                <Text style={styles.text}>{translate.t('cardId')} : {params.id}</Text>
                <Text style={styles.text}>{translate.t('cardNo')} : {params.cardNo}</Text>
                <Text style={styles.text}>{translate.t('cvvSeen')} : {params.showCvv === 'true' ? translate.t('yes') : translate.t('no')}</Text>
                <Text>{translate.t('currentLocale')} : {currLang}</Text>
                <Text>{translate.t('deviceLocale')} : {Localization.getLocales()[0].languageCode}</Text>
                <View style={styles.btnContainer}>
                    <Button
                        title={"Translate"}
                        onPress={() => {
                            if (currLang == 'en') {
                                translate.locale = 'hi';
                                setCurrLang('hi')
                            } else if(currLang == 'hi') {
                                translate.locale = 'te';
                                setCurrLang('te')
                            } else {
                                translate.locale = 'en';
                                setCurrLang('en')
                            }
                        }}
                    />
                </View>
            </View>
            <View style={styles.refreshView}>
                <Animated.Image
                    source={require('./../assets/sync.png')}
                    style={[{ width: 20, height: 20, marginBottom: 30 }, animatedStyles]}
                />
                <Button
                    title={btntxt}
                    onPress={() => {
                        if (isRefreshing.value > 0) {
                            setIsShow(false)
                            setBtnTxt("Animate")
                        } else {
                            setIsShow(true)
                            setBtnTxt("Stop")
                        }

                    }}
                />
            </View>
            <View style={styles.btnContainer}>
                <Link href="/" style={styles.button}>Go Back</Link>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { flex: 1, alignItems: 'flex-start' },
    title: { fontSize: 24, fontWeight: 'bold', color: 'black' },
    cardDetails: { flex: 3, alignItems: 'center', justifyContent: 'center' },
    refreshView: { flex: 3, alignItems: 'center', justifyContent: 'center' },
    btnContainer: { flex: 2, alignItems: 'center', justifyContent: 'center' },
    text: { fontSize: 20, fontWeight: 'normal', color: 'black' },
    button: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10
    }
})

export default details;