import { useState } from "react";
import Animated, { useAnimatedReaction, clamp, useSharedValue, withTiming, useAnimatedStyle, interpolate } from "react-native-reanimated"
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";

const Card = ({ card, index, scrollY, activeSelectedCardIndex, opacity }) => {
    const [cardHeight, setCardHeight] = useState(0);
    const showCvv = useSharedValue(0);
    //const translateY = useDerivedValue(() => clamp(-scrollY.value, -1 * index * cardHeight, 0));
    const translateY = useSharedValue(0);
    const { height: screenHeight } = useWindowDimensions();

    useAnimatedReaction(() => scrollY.value, (current) => {
        translateY.value = clamp(-current, -1 * index * cardHeight - index * 10, 0);
    });

    useAnimatedReaction(() => card.showCvv, (current, previous) => {
        showCvv.value = card.showCvv;
    });

    const frontAnimatedStyles = useAnimatedStyle(() => {
        const rotateValue = interpolate(showCvv.value, [0, 1], [0, 180])
        return {
            width: Platform.OS === 'web' ? 600 : '100%',
            transform: [
                {
                    rotateY: withTiming(`${rotateValue}deg`, { duration: 1000 })
                }
            ]
        }
    })
    const backAnimatedStyles = useAnimatedStyle(() => {
        const rotateValue = interpolate(showCvv.value, [0, 1], [180, 360])
        return {
            width: Platform.OS === 'web' ? 600 : '100%',
            transform: [
                {
                    rotateY: withTiming(`${rotateValue}deg`, { duration: 1000 })
                }
            ]
        }
    })

    useAnimatedReaction(() => activeSelectedCardIndex.value, (current, previous) => {
        if (current === previous) {
            opacity.value = withTiming(0, { duration: 1000 });
            return
        }
        if (activeSelectedCardIndex.value === null) {
            translateY.value = withTiming(clamp(-scrollY.value, -index * cardHeight, 0), { duration: 500 });
            opacity.value = withTiming(0, { duration: 1000 });
        } else if (activeSelectedCardIndex.value === index) {
            translateY.value = withTiming(-index * (cardHeight + 10), { duration: 500 });
            opacity.value = withTiming(1, { duration: 1000 });
        } else {
            translateY.value = withTiming(-index * cardHeight * 0.9 + screenHeight * 0.7, { duration: 500 });
        }
    });

    const tap = Gesture.Tap().onEnd(() => {
        if (activeSelectedCardIndex.value == null) {
            activeSelectedCardIndex.value = index;
        } else {
            activeSelectedCardIndex.value = null;
        }
    });

    return (
        <GestureDetector gesture={tap}>
            <View>
                <Animated.View
                    key={index + "_front"}
                    style={[frontAnimatedStyles, {
                        backfaceVisibility: 'hidden',
                        position: "absolute",
                    }]}
                >
                    <Animated.Image
                        onLayout={event => {
                            setCardHeight(event.nativeEvent.layout.height)
                        }}
                        source={card.front}
                        style={{
                            width: '100%',
                            borderRadius: 16,
                            height: undefined,
                            aspectRatio: 5 / 3,
                            marginBottom: 10,
                            transform: [
                                {
                                    translateY: translateY
                                }
                            ]
                        }}
                    /></Animated.View>

                <Animated.View
                    key={index + "_back"}
                    style={[backAnimatedStyles, {
                        backfaceVisibility: 'hidden',
                    }]}
                >
                    <Animated.Image
                        onLayout={event => {
                            setCardHeight(event.nativeEvent.layout.height)
                        }}
                        source={card.back}
                        style={{
                            width: '100%',
                            borderRadius: 16,
                            height: undefined,
                            aspectRatio: 5 / 3,
                            marginBottom: 10,
                            transform: [
                                {
                                    translateY: translateY
                                }
                            ]
                        }}
                    /></Animated.View>

                {/* {showCvv.value ?
                        <Animated.View
                            key={index + "_back"}
                            entering={FlipInEasyY.duration(200).delay(200)}
                            exiting={FlipOutEasyY.duration(200)}
                            >
                            <Animated.Image
                                onLayout={event => setCardHeight(event.nativeEvent.layout.height)}
                                source={card.back}
                                style={{
                                    width: '100%',
                                    borderRadius: 16,
                                    height: undefined,
                                    aspectRatio: 5 / 3,
                                    marginBottom: 10,
                                    transform: [
                                        {
                                            translateY: translateY
                                        }
                                    ]
                                }}
                            /></Animated.View> :
                        <Animated.View
                            key={index + "_front"}
                            entering={FlipInEasyY.duration(200).delay(200)}
                            exiting={FlipOutEasyY.duration(200)}
                            >
                            <Animated.Image
                                onLayout={event => setCardHeight(event.nativeEvent.layout.height)}
                                source={card.front}
                                style={{
                                    width: '100%',
                                    borderRadius: 16,
                                    height: undefined,
                                    aspectRatio: 5 / 3,
                                    marginBottom: 10,
                                    transform: [
                                        {
                                            translateY: translateY
                                        }
                                    ]
                                }}
                            /></Animated.View>} */}
            </View>
        </GestureDetector>
    )
}


const styles = StyleSheet.create({

});

export default Card;