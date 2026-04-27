import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeIn, 
  LinearTransition, 
  SlideInDown, 
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ImageWithFallback } from '../ui/ImageWithFallback';

const PHOTO_1 = "https://images.unsplash.com/photo-1758764340872-7c07d883227f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwY2FzdWFsJTIwc3RyZWV0JTIwc3R5bGUlMjB1cmJhbiUyMHBvcnRyYWl0JTIwY2FuZGlkfGVufDF8fHx8MTc3NjYzODY2MHww&ixlib=rb-4.1.0&q=80&w=1080";
const PHOTO_2 = "https://images.unsplash.com/photo-1766038803021-88d7cccfa5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGxhdWdoaW5nJTIwam95ZnVsJTIwb3V0ZG9vciUyMHJvb2Z0b3AlMjBnb2xkZW4lMjBob3VyfGVufDF8fHx8MTc3NjYzODY2MHww&ixlib=rb-4.1.0&q=80&w=1080";
const PHOTO_3 = "https://images.unsplash.com/photo-1643325299951-7bdb4de5843b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHRlY2hubyUyMHJhdmUlMjBjbHViJTIwbmVvbiUyMGxpZ2h0cyUyMGRhbmNlfGVufDF8fHx8MTc3NjYzODY2MHww&ixlib=rb-4.1.0&q=80&w=1080";
const ALBUM = "https://images.unsplash.com/photo-1744908135320-94654608a753?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbXVzaWMlMjBhbGJ1bSUyMGNvdmVyJTIwdmlueWwlMjBuZW9uJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzc2NjM4NjU2fDA&ixlib=rb-4.1.0&q=80&w=1080";
const EVENT_IMG = "https://images.unsplash.com/photo-1765738042644-a290f0a4a29f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBldmVudCUyMHZlbnVlJTIwZGFyayUyMG1vb2R5JTIwYXRtb3NwaGVyaWMlMjBsaWdodHN8ZW58MXx8fHwxNzc2NjM4NjU3fDA&ixlib=rb-4.1.0&q=80&w=1080";

type VibeTag = { id: string; label: string; icon: any; color: "purple" | "blue" | "none"; };

const INITIAL_TAGS: VibeTag[] = [
  { id: "techno", label: "Techno", icon: "headset", color: "purple" },
  { id: "night-owl", label: "Night Owl", icon: "moon", color: "blue" },
  { id: "raves", label: "Raves", icon: "flash", color: "purple" },
  { id: "berlin", label: "Berlin", icon: "location", color: "none" },
  { id: "photography", label: "Photography 📷", icon: "camera", color: "none" },
  { id: "festivals", label: "Festivals", icon: "ticket", color: "blue" },
];

const tagStyle = {
  purple: { bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.4)", text: "#c4b5fd", xColor: "#a78bfa" },
  blue: { bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.4)", text: "#93c5fd", xColor: "#60a5fa" },
  none: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.7)", xColor: "rgba(255,255,255,0.4)" },
};

function AnimatedPressable({ onPress, children, style, scaleTo = 0.9, className }: any) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(scaleTo, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); }}
      onPress={onPress}
      className={className}
    >
      <Animated.View style={[style, animatedStyle]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View className="px-1 mb-3">
      <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: '600', letterSpacing: 0.88, textTransform: "uppercase" }}>
        {label}
      </Text>
    </View>
  );
}

function FilledPhotoSlot({ src, onRemove }: { src: string; onRemove: () => void }) {
  return (
    <View className="relative overflow-hidden" style={{ borderRadius: 16, aspectRatio: 1, width: '31%', marginBottom: '3.5%' }}>
      <ImageWithFallback source={src} alt="Profile photo" className="w-full h-full" />
      
      <AnimatedPressable onPress={onRemove} scaleTo={0.85} className="absolute top-2 right-2 z-10">
        <View style={{ width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(0,0,0,0.6)" }}>
          <Ionicons name="close" size={12} color="white" />
        </View>
      </AnimatedPressable>

      <View className="absolute bottom-2 left-2 z-10">
        <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(0,0,0,0.6)" }}>
          <Ionicons name="ellipsis-horizontal" size={14} color="#d1d5db" />
        </View>
      </View>
    </View>
  );
}

function EmptyPhotoSlot({ onClick }: { onClick: () => void }) {
  return (
    <AnimatedPressable onPress={onClick} scaleTo={0.95} style={{ borderRadius: 16, aspectRatio: 1, width: '31%', marginBottom: '3.5%', backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: "rgba(99,102,241,0.15)", borderWidth: 1, borderColor: "rgba(99,102,241,0.3)" }}>
        <Ionicons name="add" size={14} color="#818cf8" />
      </View>
    </AnimatedPressable>
  );
}

function SpotifyEditWidget({ onChangeClick }: { onChangeClick: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(38);
  return (
    <View className="relative">
      <View className="rounded-3xl p-4 border" style={{ backgroundColor: "rgba(22,163,74,0.05)", borderColor: "rgba(34,197,94,0.3)" }}>
        <View className="flex-row items-center mb-4" style={{ gap: 12 }}>
          <View className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" }}>
            <ImageWithFallback source={ALBUM} alt="Album art" className="w-full h-full" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-sm font-bold" numberOfLines={1}>Closer (Remastered)</Text>
            <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>Nine Inch Nails</Text>
          </View>
          <View className="flex-row items-center flex-shrink-0" style={{ gap: 8 }}>
            <AnimatedPressable onPress={() => setProgress((p) => Math.max(0, p - 10))} scaleTo={0.88} className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
              <Ionicons name="play-skip-back" size={12} color="#d1d5db" />
            </AnimatedPressable>
            <AnimatedPressable onPress={() => setPlaying((p) => !p)} scaleTo={0.88} className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: playing ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.05)", borderColor: playing ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.2)" }}>
              {playing ? <Ionicons name="pause" size={16} color="#4ade80" /> : <Ionicons name="play" size={16} color="white" style={{ marginLeft: 2 }} />}
            </AnimatedPressable>
            <AnimatedPressable onPress={() => setProgress((p) => Math.min(100, p + 10))} scaleTo={0.88} className="w-8 h-8 rounded-full flex items-center justify-center border" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.1)" }}>
              <Ionicons name="play-skip-forward" size={12} color="#d1d5db" />
            </AnimatedPressable>
          </View>
        </View>
        <View className="flex-row items-center" style={{ gap: 10 }}>
          <Text className="text-gray-500 font-medium" style={{ fontSize: 10 }}>1:43</Text>
          <View className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
            <LinearGradient colors={['#22c55e', '#16a34a']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ height: '100%', width: `${progress}%`, borderRadius: 999 }} />
          </View>
          <Text className="text-gray-500 font-medium" style={{ fontSize: 10 }}>4:29</Text>
          <View className="w-5 h-5 rounded-full items-center justify-center" style={{ backgroundColor: "#22c55e" }}>
            <Ionicons name="musical-note" size={10} color="#000" />
          </View>
        </View>
      </View>
      <View className="flex-row justify-end mt-3">
        <AnimatedPressable onPress={onChangeClick} scaleTo={0.94} className="flex-row items-center px-4 py-2 rounded-full border" style={{ gap: 6, backgroundColor: "rgba(30,27,75,0.6)", borderColor: "rgba(79,70,229,0.5)" }}>
          <Ionicons name="link" size={14} color="#a5b4fc" />
          <Text className="text-indigo-200 text-xs font-semibold">Változtatás</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

function EditableEventCard({ onEdit, onRemove }: { onEdit: () => void; onRemove: () => void; }) {
  return (
    <View>
      <View className="relative overflow-hidden rounded-3xl border" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
        <View className="relative h-28 overflow-hidden">
          <ImageWithFallback source={EVENT_IMG} alt="Boiler Room Budapest" className="w-full h-full" />
          <LinearGradient colors={['transparent', 'rgba(11,13,23,0.95)']} style={StyleSheet.absoluteFillObject} />
          
          <BlurView intensity={12} tint="dark" className="absolute top-3 right-3 flex-row items-center px-2 py-1 rounded-full border" style={{ gap: 4, backgroundColor: "rgba(59,130,246,0.25)", borderColor: "rgba(59,130,246,0.5)", overflow: 'hidden' }}>
            <Ionicons name="wifi" size={10} color="#93c5fd" />
            <Text className="text-blue-200 font-bold tracking-wider" style={{ fontSize: 9 }}>LIVE</Text>
          </BlurView>
        </View>

        <View className="relative flex-row items-center mx-4">
          <View className="flex-1 border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
          <View className="w-3 h-3 rounded-full mx-2 flex-shrink-0" style={{ backgroundColor: "#0B0D17", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }} />
          <View className="flex-1 border-t border-dashed" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
        </View>

        <View className="px-5 pt-3 pb-4">
          <View className="flex-row items-start justify-between mb-3">
            <View>
              <Text className="text-white font-bold" style={{ fontSize: 15 }}>Boiler Room Budapest</Text>
              <Text className="text-gray-400 text-xs mt-1">Turbina Arts Center, Budapest</Text>
            </View>
            <View className="flex-shrink-0 px-3 py-1.5 rounded-full border" style={{ backgroundColor: "rgba(59,130,246,0.15)", borderColor: "rgba(59,130,246,0.4)" }}>
              <Text className="text-blue-300 font-bold" style={{ fontSize: 11 }}>Going ✓</Text>
            </View>
          </View>
          <View className="flex-row items-center" style={{ gap: 16 }}>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Ionicons name="time-outline" size={14} color="#9ca3af" />
              <Text className="text-gray-300 text-xs font-medium">Friday, Apr 25</Text>
            </View>
            <View className="flex-row items-center" style={{ gap: 6 }}>
              <Ionicons name="people-outline" size={14} color="#9ca3af" />
              <Text className="text-gray-300 text-xs font-medium">340 going</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex-row justify-end gap-3 mt-4 mb-5">
        <AnimatedPressable onPress={onEdit} scaleTo={0.93} className="flex-row items-center px-4 py-2 rounded-full" style={{ gap: 6, backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }}>
          <Ionicons name="pencil" size={14} color="#d1d5db" />
          <Text className="text-gray-300 text-xs font-semibold">Szerkesztés</Text>
        </AnimatedPressable>
        <AnimatedPressable onPress={onRemove} scaleTo={0.93} className="flex-row items-center px-4 py-2 rounded-full" style={{ gap: 6, backgroundColor: "rgba(239,68,68,0.1)", borderWidth: 1, borderColor: "rgba(239,68,68,0.3)" }}>
          <Ionicons name="close" size={14} color="#fca5a5" />
          <Text className="text-red-300 text-xs font-semibold">Eltávolítás</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

function SaveToast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  
  return (
    <Animated.View 
      entering={SlideInDown.springify().damping(26).stiffness(320)}
      exiting={SlideOutUp}
      pointerEvents="none"
      className="absolute bottom-10 left-0 right-0 items-center justify-center z-50"
    >
      <BlurView 
        intensity={16}
        tint="dark"
        className="flex-row items-center px-5 py-3 rounded-2xl border" 
        style={{ gap: 8, backgroundColor: "rgba(34,197,94,0.15)", borderColor: "rgba(34,197,94,0.35)", elevation: 5, shadowColor: "rgba(34,197,94,0.3)", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 12, overflow: 'hidden' }}
      >
        <Ionicons name="checkmark" size={16} color="#4ade80" />
        <Text className="text-green-300 text-sm font-semibold">Profil mentve!</Text>
      </BlurView>
    </Animated.View>
  );
}

const ABOUT_ME_TEXT = "Chasing the 4AM feeling in basements, warehouses & rooftops. Into deep kicks, sharp hi-hats, and cold drinks. If you know Boiler Room, you already know me. Always down to discover new sounds, new cities, and new people who dance with their eyes closed. 🖤";

export default function EditProfileModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [photos, setPhotos] = useState<(string | null)[]>([PHOTO_1, PHOTO_2, PHOTO_3, null, null, null, null, null, null]);
  const [aboutText, setAboutText] = useState(ABOUT_ME_TEXT);
  const [bioFocused, setBioFocused] = useState(false);
  const MAX_CHARS = 500;
  const [vibeTags, setVibeTags] = useState<VibeTag[]>(INITIAL_TAGS);
  const [showEvent, setShowEvent] = useState(true);
  const [saved, setSaved] = useState(false);

  const removeTag = (id: string) => setVibeTags((tags) => tags.filter((t) => t.id !== id));
  const removePhoto = (idx: number) => setPhotos((prev) => { const next = [...prev]; next[idx] = null; return next; });
  const handleSave = () => { setSaved(true); setTimeout(() => { setSaved(false); onClose(); }, 1400); };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 relative" style={{ backgroundColor: '#0B0D17' }}>
        {/* Header */}
        <View className="flex-shrink-0 px-5 pt-6 pb-2" style={{ backgroundColor: "#0B0D17" }}>
          <View className="flex-row items-center justify-between mb-4">
            <AnimatedPressable onPress={onClose} scaleTo={0.9} className="w-10 h-10 rounded-full flex items-center justify-center border" style={{ backgroundColor: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
              <Ionicons name="arrow-back" size={18} color="#9ca3af" />
            </AnimatedPressable>
            <AnimatedPressable onPress={handleSave} scaleTo={0.93} className="flex-row items-center gap-2 px-5 py-2.5 rounded-full border" style={{ backgroundColor: "rgba(30,27,75,0.6)", borderColor: "rgba(79,70,229,0.5)" }}>
              <Ionicons name="checkmark" size={16} color="#a5b4fc" />
              <Text className="text-indigo-200 text-sm font-bold">Mentés</Text>
            </AnimatedPressable>
          </View>
          <Text className="text-white text-center" style={{ fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>Profil szerkesztése</Text>
        </View>

        <ScrollView className="flex-1 px-5 pt-6 pb-12" showsVerticalScrollIndicator={false}>
          {/* Photo Manager (Grid) */}
          <View className="mb-8">
            <SectionHeader label="FOTÓK KEZELÉSE" />
            <View className="rounded-3xl border p-3.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <View className="flex-row flex-wrap justify-between">
                {photos.map((src, idx) => src ? <FilledPhotoSlot key={idx} src={src} onRemove={() => removePhoto(idx)} /> : <EmptyPhotoSlot key={idx} onClick={() => {}} />)}
              </View>
              <Text className="text-center text-gray-600 mt-2 font-medium" style={{ fontSize: 11 }}>Tartsd lenyomva a mozgatáshoz · Legfeljebb 9 fotó</Text>
            </View>
          </View>

          {/* About Me */}
          <View className="mb-8">
            <SectionHeader label="RÓLAM" />
            <View className="relative rounded-3xl border overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)", borderColor: bioFocused ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.1)" }}>
              <TextInput 
                value={aboutText} 
                onChangeText={(text) => setAboutText(text.slice(0, MAX_CHARS))} 
                onFocus={() => setBioFocused(true)} 
                onBlur={() => setBioFocused(false)} 
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                placeholder="Mesélj magadról..."
                placeholderTextColor="rgba(255,255,255,0.3)"
                style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 22, minHeight: 140, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 36 }}
              />
              <View className="absolute bottom-3 right-4 flex-row items-center pointer-events-none">
                <Text style={{ fontSize: 11, fontWeight: '500', color: aboutText.length > MAX_CHARS * 0.9 ? "#fca5a5" : "rgba(255,255,255,0.4)" }}>{aboutText.length} / {MAX_CHARS}</Text>
              </View>
            </View>
          </View>

          {/* My Vibe */}
          <View className="mb-8">
            <SectionHeader label="A VIBE-OM" />
            <View className="rounded-3xl border p-5" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
              <View className="flex-row flex-wrap" style={{ gap: 10 }}>
                {vibeTags.map((tag) => {
                  const style = tagStyle[tag.color];
                  return (
                    <Animated.View key={tag.id} layout={LinearTransition.springify()} entering={FadeIn.springify()} className="flex-row items-center pl-3.5 pr-2 py-2 rounded-full border" style={{ gap: 8, backgroundColor: style.bg, borderColor: style.border }}>
                      <Ionicons name={tag.icon} size={14} color={style.text} />
                      <Text className="text-sm font-semibold" style={{ color: style.text }}>{tag.label}</Text>
                      <AnimatedPressable onPress={() => removeTag(tag.id)} scaleTo={0.85} className="w-5 h-5 rounded-full flex items-center justify-center ml-1" style={{ backgroundColor: "rgba(0,0,0,0.2)" }}>
                        <Ionicons name="close" size={10} color={style.xColor} />
                      </AnimatedPressable>
                    </Animated.View>
                  );
                })}
                <AnimatedPressable scaleTo={0.93} className="flex-row items-center px-4 py-2 rounded-full border" style={{ gap: 8, backgroundColor: "transparent", borderColor: "rgba(99,102,241,0.4)", borderStyle: "dashed" }}>
                  <Ionicons name="add" size={14} color="#818cf8" />
                  <Text className="text-indigo-400 text-sm font-semibold">Új vibe hozzáadása</Text>
                </AnimatedPressable>
              </View>
            </View>
          </View>

          {/* Spotify */}
          <View className="mb-8"><SectionHeader label="SPOTIFY ANTHEM" /><SpotifyEditWidget onChangeClick={() => {}} /></View>

          {/* Events */}
          <View className="mb-8">
            <SectionHeader label="ESEMÉNYEK — GOING TO..." />
            {showEvent && (
              <Animated.View entering={FadeIn} exiting={SlideOutUp}>
                <EditableEventCard onEdit={() => {}} onRemove={() => setShowEvent(false)} />
              </Animated.View>
            )}
            {!showEvent && <Text className="text-gray-500 text-sm text-center py-4">Nincs hozzáadott esemény</Text>}
            <AnimatedPressable scaleTo={0.97} className="w-full flex-row items-center justify-center py-3.5 rounded-2xl border" style={{ gap: 8, backgroundColor: "rgba(15,23,42,0.6)", borderColor: "rgba(59,130,246,0.3)" }}>
              <Ionicons name="search" size={18} color="#60a5fa" />
              <Text className="text-blue-300 text-sm font-bold">Keresés események</Text>
            </AnimatedPressable>
          </View>
          
          <View className="h-12" />
        </ScrollView>

        <SaveToast visible={saved} />
      </View>
    </Modal>
  );
}
