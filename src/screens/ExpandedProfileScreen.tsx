import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut, useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ImageWithFallback } from "../components/ui/ImageWithFallback";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HERO = "https://images.unsplash.com/photo-1585362606685-c35cd0cc4d4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVubmluZyUyMGFzaWFuJTIwd29tYW4lMjBwb3J0cmFpdCUyMGRhcmslMjBtb29keSUyMGVkaXRvcmlhbCUyMGhpZ2glMjBmYXNoaW9ufGVufDF8fHx8MTc3NjYzODY1NXww&ixlib=rb-4.1.0&q=80&w=1080";
const ALBUM = "https://images.unsplash.com/photo-1744908135320-94654608a753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXVzaWMlMjBhbGJ1bSUyMGNvdmVyJTIwdmlueWwlMjBuZW9uJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc2NjM4NjU2fDA&ixlib=rb-4.1.0&q=80&w=1080";
const EVENT_IMG = "https://images.unsplash.com/photo-1765738042644-a290f0a4a29f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBldmVudCUyMHZlbnVlJTIwZGFyayUyMG1vb2R5JTIwYXRtb3NwaGVyaWMlMjBsaWdodHN8ZW58MXx8fHwxNzc2NjM4NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080";
const PHOTO_1 = "https://images.unsplash.com/photo-1758764340872-7c07d883227f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwY2FzdWFsJTIwc3RyZWV0JTIwc3R5bGUlMjB1cmJhbiUyMHBvcnRyYWl0JTIwY2FuZGlkfGVufDF8fHx8MTc3NjYzODY2MHww&ixlib=rb-4.1.0&q=80&w=1080";
const PHOTO_2 = "https://images.unsplash.com/photo-1766038803021-88d7cccfa5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGxhdWdoaW5nJTIwam95ZnVsJTIwb3V0ZG9vciUyMHJvb2Z0b3AlMjBnb2xkZW4lMjBob3VyfGVufDF8fHx8MTc3NjYzODY2MHww&ixlib=rb-4.1.0&q=80&w=1080";
const PHOTO_3 = "https://images.unsplash.com/photo-1643325299951-7bdb4de5843b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRlY2hubyUyMHJhdmUlMjBjbHViJTIwbmVvbiUyMGxpZ2h0cyUyMGRhbmNlfGVufDF8fHx8MTc3NjYzODY2MHww&ixlib=rb-4.1.0&q=80&w=1080";

const tags = [
  { label: "Techno", glow: true, color: "purple" },
  { label: "Night Owl", glow: false, color: "blue" },
  { label: "Raves", glow: true, color: "purple" },
  { label: "Drinks 🍸", glow: false, color: "none" },
  { label: "House Music", glow: true, color: "blue" },
  { label: "Early Mornings 🌅", glow: false, color: "none" },
  { label: "DJ Culture", glow: true, color: "purple" },
  { label: "Berlin", glow: false, color: "none" },
  { label: "Photography 📷", glow: false, color: "none" },
  { label: "Festivals", glow: true, color: "blue" },
];

const tagStyles: Record<string, { bg: string; border: string; text: string; shadowColor: string }> = {
  purple: { bg: "rgba(139,92,246,0.12)", border: "rgba(139,92,246,0.45)", text: "#c4b5fd", shadowColor: "#8b5cf6" },
  blue: { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.45)", text: "#93c5fd", shadowColor: "#3b82f6" },
  none: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.65)", shadowColor: "transparent" },
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

function SpotifyCard() {
  const [playing, setPlaying] = useState(true);
  const progress = 38;

  const pulse1 = useSharedValue(1);
  const pulse2 = useSharedValue(1);

  useEffect(() => {
    if (playing) {
      pulse1.value = withRepeat(withSequence(withTiming(0.4, { duration: 400 }), withTiming(1, { duration: 400 })), -1, true);
      pulse2.value = withRepeat(withSequence(withTiming(0.4, { duration: 300 }), withTiming(1, { duration: 300 })), -1, true);
    } else {
      pulse1.value = 1;
      pulse2.value = 1;
    }
  }, [playing]);

  const p1Style = useAnimatedStyle(() => ({ opacity: pulse1.value }));
  const p2Style = useAnimatedStyle(() => ({ opacity: pulse2.value }));

  return (
    <View className="rounded-3xl p-4 border overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}>
      <View className="flex-row items-center mb-3">
        <View className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 mr-3">
          <ImageWithFallback source={ALBUM} alt="Album" className="w-full h-full" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-sm font-semibold" numberOfLines={1}>Closer (Remastered)</Text>
          <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={1}>Nine Inch Nails</Text>
        </View>
        <View className="flex-row items-center ml-2 border border-transparent">
          <AnimatedTouchableOpacity
            onPress={() => setPlaying((p) => !p)}
            className="w-8 h-8 rounded-full items-center justify-center border mr-2"
            style={{
              backgroundColor: playing ? "rgba(30,215,96,0.2)" : "rgba(255,255,255,0.06)",
              borderColor: playing ? "rgba(30,215,96,0.4)" : "rgba(255,255,255,0.1)",
              shadowColor: playing ? "#1DB954" : "transparent",
              shadowOpacity: playing ? 0.35 : 0,
              shadowRadius: 12,
              elevation: playing ? 5 : 0
            }}
          >
            {playing ? (
              <View className="flex-row gap-0.5" style={{ gap: 2 }}>
                <Animated.View className="w-1 h-3 rounded-full bg-green-400" style={p1Style} />
                <Animated.View className="w-1 h-3 rounded-full bg-green-400" style={p2Style} />
              </View>
            ) : (
                <Ionicons name="play" size={12} color="rgba(255,255,255,0.7)" style={{ marginLeft: 2 }} />
            )}
          </AnimatedTouchableOpacity>
          <View className="w-6 h-6 rounded-full items-center justify-center" style={{ backgroundColor: "#1DB954" }}>
            <Ionicons name="musical-notes" size={12} color="black" />
          </View>
        </View>
      </View>
      <View className="flex-row items-center">
        <Text className="text-gray-600 text-[9px] mr-2">1:43</Text>
        <View className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          <LinearGradient
            colors={["#1DB954", "#16a34a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${progress}%`, height: "100%", borderRadius: 999 }}
          />
        </View>
        <Text className="text-gray-600 text-[9px] ml-2">4:29</Text>
      </View>
    </View>
  );
}

function EventTicketCard() {
  return (
    <View className="relative overflow-hidden rounded-3xl border" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)", elevation: 5, shadowColor: "#3b82f6", shadowOpacity: 0.1, shadowRadius: 28 }}>
      <View className="relative h-28 overflow-hidden">
        <ImageWithFallback source={EVENT_IMG} alt="Boiler Room" className="w-full h-full" />
        <LinearGradient
          colors={["rgba(11,13,23,0.55)", "rgba(11,13,23,0.1)", "rgba(11,13,23,0.55)"]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={["transparent", "rgba(11,13,23,0.95)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View className="absolute top-2.5 right-3 flex-row items-center px-2 py-1 rounded-full border" style={{ backgroundColor: "rgba(59,130,246,0.2)", borderColor: "rgba(59,130,246,0.4)" }}>
          <Ionicons name="wifi" size={10} color="#60a5fa" style={{ marginRight: 4 }} />
          <Text className="text-blue-300 text-[9px] font-bold tracking-wider">LIVE</Text>
        </View>
      </View>
      <View className="relative flex-row items-center mx-4">
        <View className="flex-1 border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
        <View className="w-3 h-3 rounded-full mx-2 border" style={{ backgroundColor: "#0B0D17", borderColor: "rgba(255,255,255,0.1)" }} />
        <View className="flex-1 border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.1)" }} />
      </View>
      <View className="px-4 pt-2 pb-4">
        <View className="flex-row items-start justify-between mb-2.5">
          <View>
            <Text className="text-white font-bold" style={{ fontSize: 15 }}>Boiler Room Budapest</Text>
            <Text className="text-gray-500 text-xs mt-0.5">Turbina Arts Center, Budapest</Text>
          </View>
          <View className="px-2.5 py-1 rounded-xl border" style={{ backgroundColor: "rgba(59,130,246,0.12)", borderColor: "rgba(59,130,246,0.3)" }}>
            <Text className="text-blue-300 text-[10px] font-bold">Going ✓</Text>
          </View>
        </View>
        <View className="flex-row items-center gap-5" style={{ gap: 20 }}>
          <View className="flex-row items-center"><Ionicons name="time-outline" size={12} color="#4b5563" style={{ marginRight: 6 }} /><Text className="text-gray-400 text-xs">Friday, Apr 18</Text></View>
          <View className="flex-row items-center"><Ionicons name="people-outline" size={12} color="#4b5563" style={{ marginRight: 6 }} /><Text className="text-gray-400 text-xs">340 going</Text></View>
          <View className="flex-row items-center"><Ionicons name="ticket-outline" size={12} color="#4b5563" style={{ marginRight: 6 }} /><Text className="text-gray-400 text-xs">Free entry</Text></View>
        </View>
      </View>
    </View>
  );
}

function OptionsMenu({ onClose }: { onClose: () => void }) {
  const items = ["Report Profile", "Block User", "Share Profile"];
  return (
    <Animated.View
        entering={ZoomIn.duration(300)}
        exiting={ZoomOut.duration(200)}
        className="absolute top-14 right-4 z-50 rounded-2xl border overflow-hidden"
        style={{
            backgroundColor: "rgba(18,22,40,0.95)",
            borderColor: "rgba(255,255,255,0.1)",
            minWidth: 160,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.6,
            shadowRadius: 32,
            elevation: 10
        }}
    >
      {items.map((item, i) => (
        <TouchableOpacity
            key={item}
            onPress={() => {
                Alert.alert('Success', 'Action completed.');
                onClose();
            }}
            className="w-full px-4 py-3 flex-row items-center"
            style={{
                borderBottomWidth: i < items.length - 1 ? 1 : 0,
                borderBottomColor: "rgba(255,255,255,0.06)"
            }}
        >
          <Text style={{ color: item === "Report Profile" || item === "Block User" ? "#f87171" : "rgba(255,255,255,0.75)", fontSize: 14 }}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

export default function ExpandedProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const passedUser = (route.params as any)?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState<null | "pass" | "like" | "super">(null);

  const handleAction = (action: "pass" | "like" | "super") => {
    setLiked(action);
    setTimeout(() => navigation.goBack(), 600);
  };

  const displayName = passedUser?.displayName || "Citra";
  const age = passedUser?.age || 23;
  const avatarUrl = passedUser?.avatarUrl || HERO;

  return (
    <View className="flex-1 bg-[#0B0D17] relative">
      {menuOpen && (
        <Pressable className="absolute inset-0 z-40" onPress={() => setMenuOpen(false)} />
      )}
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="relative" style={{ height: 520 }}>
          <ImageWithFallback source={avatarUrl} alt={displayName} className="absolute inset-0 w-full h-full" />
          <LinearGradient
            colors={["rgba(11,13,23,0.55)", "transparent", "transparent", "rgba(11,13,23,0.6)", "rgba(11,13,23,0.98)"]}
            locations={[0, 0.28, 0.5, 0.72, 1]}
            style={StyleSheet.absoluteFillObject}
          />
          
          <View className="absolute left-0 right-0 flex-row items-center justify-between px-4 z-10" style={{ top: Math.max(insets.top, 20) }}>
            <AnimatedTouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 rounded-2xl items-center justify-center border"
              style={{ backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.15)", transform: [{scale: 1}] }}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </AnimatedTouchableOpacity>
            <AnimatedTouchableOpacity
              onPress={() => setMenuOpen((v) => !v)}
              className="w-10 h-10 rounded-2xl items-center justify-center border"
              style={{ backgroundColor: "rgba(0,0,0,0.35)", borderColor: "rgba(255,255,255,0.15)", transform: [{scale: 1}] }}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color="white" />
            </AnimatedTouchableOpacity>
          </View>

          <View className="absolute bottom-14 left-0 right-0 px-5 z-10">
            <View className="flex-row items-center gap-2.5 mb-1" style={{ gap: 10 }}>
              <Text className="text-white drop-shadow-2xl" style={{ fontSize: 32, fontWeight: '800', letterSpacing: -0.5, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 4}, textShadowRadius: 10 }}>
                {displayName}, {age}
              </Text>
              <View className="w-7 h-7 rounded-full items-center justify-center" style={{ elevation: 5, shadowColor: "#3b82f6", shadowOpacity: 0.7, shadowRadius: 14 }}>
                <LinearGradient
                   colors={["#2563eb", "#60a5fa"]}
                   start={{x:0, y:0}} end={{x:1, y:1}}
                   style={{ width: '100%', height: '100%', borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text className="text-white text-xs font-black">✓</Text>
                </LinearGradient>
              </View>
            </View>
            <View className="flex-row items-center gap-1.5" style={{ gap: 6 }}>
              <Ionicons name="location-outline" size={14} color="#9ca3af" />
              <Text className="text-gray-300 text-sm">2.5 km away</Text>
              <Text className="text-gray-600 mx-1">·</Text>
              <View className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e", shadowColor: "#22c55e", shadowOpacity: 0.9, shadowRadius: 6, elevation: 3 }} />
              <Text className="text-green-400 text-sm">Online now</Text>
            </View>
          </View>

          <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center z-20" style={{ transform: [{ translateY: 40 }], gap: 48 }}>
            <AnimatedTouchableOpacity onPress={() => handleAction("pass")} className="w-16 h-16 rounded-full items-center justify-center border" style={{ backgroundColor: liked === "pass" ? "rgba(239,68,68,0.4)" : "rgba(239,68,68,0.12)", borderColor: "rgba(239,68,68,0.45)", shadowColor: "#ef4444", shadowOpacity: 0.45, shadowRadius: 24, elevation: 8, transform: [{scale: 1}] }}>
                <Ionicons name="close" size={32} color="#f87171" style={{ fontWeight: 'bold' }} />
            </AnimatedTouchableOpacity>

            <AnimatedTouchableOpacity onPress={() => handleAction("like")} className="w-16 h-16 rounded-full items-center justify-center border" style={{ backgroundColor: liked === "like" ? "rgba(34,197,94,0.4)" : "rgba(34,197,94,0.12)", borderColor: "rgba(34,197,94,0.45)", shadowColor: "#22c55e", shadowOpacity: 0.5, shadowRadius: 24, elevation: 8, transform: [{scale: 1}] }}>
                <Ionicons name={liked === "like" ? "heart" : "heart-outline"} size={32} color="#4ade80" />
            </AnimatedTouchableOpacity>
          </View>
        </View>

        <View className="px-5 pt-14 pb-8">
            <View className="mb-6">
                <Text className="text-white font-bold mb-2.5" style={{ fontSize: 16, letterSpacing: -0.2 }}>About Me</Text>
                <Text className="leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13.5 }}>
                    Chasing the 4AM feeling in basements, warehouses & rooftops. Into deep kicks, sharp hi-hats, and cold drinks. If you know Boiler Room, you already know me. Always down to discover new sounds, new cities, and new people who dance with their eyes closed. 🖤
                </Text>
            </View>

            <View className="mb-6">
                <Text className="text-white font-bold mb-3" style={{ fontSize: 16, letterSpacing: -0.2 }}>My Vibe</Text>
                <View className="flex-row flex-wrap" style={{ gap: 8 }}>
                    {tags.map((tag) => {
                        const style = tagStyles[tag.glow ? tag.color : "none"];
                        return (
                            <View key={tag.label} className="px-3 py-1.5 rounded-full border" style={{ backgroundColor: style.bg, borderColor: style.border, shadowColor: style.shadowColor, shadowOpacity: 0.4, shadowRadius: 8, elevation: tag.glow ? 2 : 0 }}>
                                <Text style={{ color: style.text, fontSize: 12, fontWeight: '500' }}>{tag.label}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            <View className="mb-6">
                <View className="flex-row items-center mb-3" style={{ gap: 8 }}>
                    <Text className="text-white font-bold" style={{ fontSize: 16, letterSpacing: -0.2 }}>Spotify Anthem</Text>
                    <Text className="text-xs font-normal text-gray-600">— {displayName}'s vibe rn</Text>
                </View>
                <SpotifyCard />
            </View>
            
            <View className="mb-6">
                <View className="flex-row items-center mb-3" style={{ gap: 8 }}>
                    <Text className="text-white font-bold" style={{ fontSize: 16, letterSpacing: -0.2 }}>Going to...</Text>
                    <View className="px-2 py-0.5 rounded-full border" style={{ backgroundColor: "rgba(59,130,246,0.1)", borderColor: "rgba(59,130,246,0.25)" }}>
                        <Text className="text-blue-400 text-[10px] font-semibold">1 event</Text>
                    </View>
                </View>
                <EventTicketCard />
            </View>

            <View className="mb-4">
                <Text className="text-white font-bold mb-3" style={{ fontSize: 16, letterSpacing: -0.2 }}>More Photos</Text>
                <View className="flex-row justify-between mb-4 mt-2">
                    {[PHOTO_1, PHOTO_2, PHOTO_3].map((src, i) => (
                        <View key={i} className="overflow-hidden border" style={{ height: 110, width: "31%", borderRadius: 20, borderColor: "rgba(255,255,255,0.08)" }}>
                            <ImageWithFallback source={src} alt={`Photo ${i + 1}`} className="w-full h-full" />
                        </View>
                    ))}
                </View>
            </View>
        </View>
      </ScrollView>

      {menuOpen && <OptionsMenu onClose={() => setMenuOpen(false)} />}
      
      {liked && (
        <Animated.View 
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(400)}
            className="absolute inset-0 z-30 pointer-events-none" 
        >
            <View style={{ flex: 1, backgroundColor: liked === "like" ? "rgba(34,197,94,0.25)" : liked === "pass" ? "rgba(239,68,68,0.25)" : "rgba(168,85,247,0.35)" }} />
        </Animated.View>
      )}
    </View>
  );
}
