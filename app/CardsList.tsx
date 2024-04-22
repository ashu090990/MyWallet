import { Button, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native"
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Card from "./components/Card";
import Animated, {
    useSharedValue,
    withDecay,
    cancelAnimation,
    clamp,
    withClamp,
    withTiming
} from 'react-native-reanimated';
import { useState } from "react";
import { Link, router } from "expo-router";

const cards = [
    { front: require('./../assets/cards/Card1.png'), back: require('./../assets/cards/Card1_back.png'), id: 1, showCvv: false, selected: false, cardNo: '1234 5678 9012 3456' },
    { front: require('./../assets/cards/Card2.png'), back: require('./../assets/cards/Card2_back.png'), id: 2, showCvv: false, selected: false, cardNo: '5678 9012 3456 1234' },
    { front: require('./../assets/cards/Card3.png'), back: require('./../assets/cards/Card3_back.png'), id: 3, showCvv: false, selected: false, cardNo: '9012 3456 1234 5678' },
    { front: require('./../assets/cards/Card4.png'), back: require('./../assets/cards/Card4_back.png'), id: 4, showCvv: false, selected: false, cardNo: '3456 1234 5678 9012' },
    { front: require('./../assets/cards/Card5.png'), back: require('./../assets/cards/Card5_back.png'), id: 5, showCvv: false, selected: false, cardNo: '1234 5678 9012 3456' },
    { front: require('./../assets/cards/Card6.png'), back: require('./../assets/cards/Card6_back.png'), id: 6, showCvv: false, selected: false, cardNo: '1234 5678 9012 3456' },
    { front: require('./../assets/cards/Card7.png'), back: require('./../assets/cards/Card7_back.png'), id: 7, showCvv: false, selected: false, cardNo: '1234 5678 9012 3456' },
    { front: require('./../assets/cards/Card8.png'), back: require('./../assets/cards/Card8_back.png'), id: 8, showCvv: false, selected: false, cardNo: '1234 5678 9012 3456' },
    { front: require('./../assets/cards/Card9.png'), back: require('./../assets/cards/Card9_back.png'), id: 9, showCvv: false, selected: false, cardNo: '1234 5678 9012 3456' },
    { front: require('./../assets/cards/Card10.png'), back: require('./../assets/cards/Card10_back.png'), id: 10, showCvv: false, selected: false, cardNo: '1234 5678 9012 3456' }
];



const CardsList = () => {
    const [listHeight, setListHeight] = useState(0);
    const { height: screenHeight } = useWindowDimensions();
    const activeSelectedCardIndex = useSharedValue(0);
    const [cardsMap, setCardsMap] = useState(new Map(cards.map(card => [card.id, card])));
    const maxScrollY = listHeight - screenHeight;
    const scrollY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const pan = Gesture.Pan().onBegin(() => {
        cancelAnimation(scrollY);
        opacity.value = withTiming(0, { duration: 1000 });
    })
        .onStart(() => {

        }).onChange((event) => {
            scrollY.value = clamp(scrollY.value - event.changeY, 0, maxScrollY);
        }).onEnd((event) => {
            scrollY.value = withClamp({ min: 0, max: maxScrollY }, withDecay({
                velocity: -event.velocityY,
            }))
        });

    const flip = () => {
        const activeCardId = activeSelectedCardIndex.value + 1;
        if (activeCardId > 0) {
            cardsMap.set(activeCardId, { ...cardsMap.get(activeCardId), showCvv: !cardsMap.get(activeCardId).showCvv });
            setCardsMap(new Map(cardsMap));
        }
        opacity.value = withTiming(1, { duration: 1000 });
    }

    const goToNewScreen = () => {
        router.push({
            pathname: "detail",
            params: cardsMap.get(activeSelectedCardIndex.value + 1)
        });
    }

    const showWebLinks = () => {
        return (
            <>
                <View style={styles.showDetailsBtn}>
                    <Link href={{
                        pathname: "detail",
                        params: cardsMap.get(activeSelectedCardIndex.value + 1)
                    }} asChild>
                        <TouchableOpacity >
                            <Text style={{ color: 'white' }}>Show Details</Text>
                        </TouchableOpacity>
                    </Link>
                </View>
                <Pressable onPress={() => flip()} style={styles.showCvvBtn}>
                    <Text style={{ color: 'white' }}>Flip Card</Text>
                </Pressable>
            </>
        )
    }

    return (
        <GestureDetector gesture={pan}>
            <View  style={[{ padding: 10 }, Platform.OS === 'web' ? { width: 620 } : {width: '100%'}]} onLayout={event => setListHeight(event.nativeEvent.layout.height)}>
                <View>
                    {Array.from(cardsMap).map(([id, card], index) => (
                        <Card
                            key={id}
                            card={card}
                            index={index}
                            scrollY={scrollY}
                            activeSelectedCardIndex={activeSelectedCardIndex}
                            opacity={opacity}
                        />
                    ))}
                    {Platform.OS === 'web' ?
                        (showWebLinks()) : (
                            <>
                                <Animated.View onTouchEnd={() => flip()} style={[styles.showCvvBtn, { opacity: opacity }]}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Flip Card</Text>
                                </Animated.View>
                                <Animated.View onTouchEnd={() => goToNewScreen()} style={[styles.showDetailsBtn, { opacity: opacity }]}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Show Details</Text>
                                </Animated.View>
                            </>)
                    }
                </View>
            </View>
        </GestureDetector >
    )
}

const styles = StyleSheet.create({
    showCvvBtn: {
        borderWidth: 1,
        borderColor: 'white',
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: "#00000080"
    },
    showDetailsBtn: {
        borderWidth: 1,
        borderColor: 'white',
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        position: 'absolute',
        left: 0,
        top: 0,
        backgroundColor: "#00000080"
    }
});

export default CardsList;