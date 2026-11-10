import React, { useEffect, useMemo, useState } from 'react';
import { Audio } from 'expo-av';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  artwork: string;
  color: string;
  audio: string;
};

const tracks: Track[] = [
  { id: '1', title: 'Midnight City Lights', artist: 'Luna Waves', album: 'After Hours', duration: '3:42', artwork: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&h=600&fit=crop', color: '#7155dd', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: '2', title: 'Golden Hour', artist: 'The Coastline', album: 'Sunroom Sessions', duration: '4:08', artwork: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=600&fit=crop', color: '#db945a', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: '3', title: 'Soft Focus', artist: 'Milo June', album: 'Little Things', duration: '2:56', artwork: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&h=600&fit=crop', color: '#63877f', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  { id: '4', title: 'Electric Bloom', artist: 'Nova Lane', album: 'Color Theory', duration: '3:31', artwork: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=600&fit=crop', color: '#c45e85', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
  { id: '5', title: 'Blue on Blue', artist: 'Sunday Stereo', album: 'Tidal', duration: '3:17', artwork: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=600&fit=crop', color: '#4183a0', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
  { id: '6', title: 'Slow Motion', artist: 'Kairo', album: 'No Rush', duration: '4:12', artwork: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=600&fit=crop', color: '#7762ae', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
  { id: '7', title: 'First Light', artist: 'Aria Bloom', album: 'Daybreak', duration: '3:05', artwork: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=600&fit=crop', color: '#7c9a62', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
  { id: '8', title: 'Neon Reverie', artist: 'Parallel', album: 'Night Drive', duration: '3:54', artwork: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600&h=600&fit=crop', color: '#7655c8', audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
];

const playlists = [
  { name: 'Late night drive', subtitle: 'A little bit of everything', image: tracks[0].artwork },
  { name: 'Easy mornings', subtitle: 'Start slow, feel good', image: tracks[1].artwork },
  { name: 'Indie discoveries', subtitle: 'Your next favorite song', image: tracks[3].artwork },
  { name: 'Quiet moments', subtitle: 'Take a breath', image: tracks[2].artwork },
];

const navItems = [
  { label: 'Home', icon: '⌂' },
  { label: 'Explore', icon: '⌕' },
  { label: 'Library', icon: '▤' },
];

export default function App() {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [activeTab, setActiveTab] = useState('Home');
  const [query, setQuery] = useState('');
  const [current, setCurrent] = useState<Track | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState<string[]>(['2']);

  useEffect(() => () => { if (sound) void sound.unloadAsync(); }, [sound]);

  const filteredTracks = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return tracks;
    return tracks.filter((track) => `${track.title} ${track.artist} ${track.album}`.toLowerCase().includes(term));
  }, [query]);

  const playTrack = async (track: Track) => {
    try {
      if (current?.id === track.id && sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          await sound.pauseAsync();
          setPlaying(false);
        } else if (status.isLoaded) {
          await sound.playAsync();
          setPlaying(true);
        }
        return;
      }
      if (sound) await sound.unloadAsync();
      setCurrent(track);
      setPlaying(true);
      const created = await Audio.Sound.createAsync(
        { uri: track.audio },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) setPlaying(status.isPlaying);
        },
      );
      setSound(created.sound);
    } catch (error) {
      setPlaying(false);
      console.warn('Could not play this demo track.', error);
    }
  };

  const toggleLike = (id: string) => setLiked((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);

  const visibleTracks = activeTab === 'Library' && !query
    ? tracks.filter((track) => liked.includes(track.id))
    : filteredTracks;

  const sectionTitle = query ? 'Search results' : activeTab === 'Explore' ? 'Explore music' : activeTab === 'Library' ? 'Your liked songs' : 'Made for your mood';

  const renderTrack = (track: Track, index: number) => (
    <Pressable key={track.id} style={[styles.trackRow, current?.id === track.id && styles.trackRowActive]} onPress={() => void playTrack(track)}>
      <View style={styles.trackNumber}>
        {current?.id === track.id && playing ? <Text style={styles.equalizer}>♫</Text> : <Text style={styles.mutedText}>{String(index + 1).padStart(2, '0')}</Text>}
      </View>
      <Image source={{ uri: track.artwork }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text numberOfLines={1} style={[styles.trackTitle, current?.id === track.id && styles.accentText]}>{track.title}</Text>
        <Text numberOfLines={1} style={styles.trackArtist}>{track.artist} · {track.album}</Text>
      </View>
      <Pressable accessibilityLabel={liked.includes(track.id) ? 'Unlike song' : 'Like song'} hitSlop={10} onPress={(event) => { event.stopPropagation(); toggleLike(track.id); }} style={styles.likeButton}>
        <Text style={[styles.heart, liked.includes(track.id) && styles.heartLiked]}>{liked.includes(track.id) ? '♥' : '♡'}</Text>
      </Pressable>
      {!compact && <Text style={styles.duration}>{track.duration}</Text>}
      <Pressable accessibilityLabel={`Play ${track.title}`} onPress={(event) => { event.stopPropagation(); void playTrack(track); }} style={styles.rowPlay}>
        <Text style={styles.rowPlayText}>{current?.id === track.id && playing ? 'Ⅱ' : '▶'}</Text>
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.appShell}>
        {!compact && (
          <View style={styles.sidebar}>
            <View style={styles.brandRow}><View style={styles.brandMark}><Text style={styles.brandMarkText}>V</Text></View><Text style={styles.brand}>VT<Text style={styles.brandAccent}>musics</Text></Text></View>
            <Text style={styles.navCaption}>MENU</Text>
            {navItems.map((item) => <Pressable key={item.label} onPress={() => { setActiveTab(item.label); setQuery(''); }} style={[styles.navItem, activeTab === item.label && styles.navItemActive]}><Text style={[styles.navIcon, activeTab === item.label && styles.accentText]}>{item.icon}</Text><Text style={[styles.navLabel, activeTab === item.label && styles.navLabelActive]}>{item.label}</Text></Pressable>)}
            <View style={styles.sidebarDivider} />
            <Text style={styles.navCaption}>YOUR COLLECTION</Text>
            <Pressable onPress={() => setActiveTab('Library')} style={styles.navItem}><Text style={styles.navIcon}>♥</Text><Text style={styles.navLabel}>Liked songs</Text></Pressable>
            <Pressable onPress={() => setActiveTab('Library')} style={styles.navItem}><Text style={styles.navIcon}>♫</Text><Text style={styles.navLabel}>Playlists</Text></Pressable>
            <View style={styles.sidebarBottom}><View style={styles.avatar}><Text style={styles.avatarText}>V</Text></View><View><Text style={styles.profileName}>Music lover</Text><Text style={styles.profileStatus}>Free account</Text></View><Text style={styles.more}>···</Text></View>
          </View>
        )}

        <View style={styles.mainColumn}>
          <View style={styles.topbar}>
            {compact && <View style={styles.brandRow}><View style={styles.brandMark}><Text style={styles.brandMarkText}>V</Text></View><Text style={styles.brand}>VT<Text style={styles.brandAccent}>musics</Text></Text></View>}
            <View style={[styles.searchBox, compact && styles.searchBoxCompact]}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Search songs, artists, albums..." placeholderTextColor="#818493" style={styles.searchInput} returnKeyType="search" /></View>
            {!compact && <Pressable style={styles.upgradeButton} onPress={() => setActiveTab('Explore')}><Text style={styles.upgradeText}>✦  Discover more</Text></Pressable>}
            {compact && <Pressable style={styles.avatar}><Text style={styles.avatarText}>V</Text></Pressable>}
          </View>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {!query && activeTab === 'Home' && (
              <View style={styles.hero}>
                <Image source={{ uri: tracks[0].artwork }} style={styles.heroImage} />
                <View style={styles.heroShade} />
                <View style={styles.heroContent}>
                  <View style={styles.eyebrow}><View style={styles.liveDot} /><Text style={styles.eyebrowText}>YOUR DAILY MIX</Text></View>
                  <Text style={styles.heroTitle}>A soundtrack{compact ? '\n' : ' '}for right now.</Text>
                  <Text style={styles.heroSubtitle}>Fresh finds and familiar favorites, picked just for you.</Text>
                  <Pressable style={styles.heroButton} onPress={() => void playTrack(tracks[0])}><Text style={styles.heroButtonText}>▶   Play your mix</Text></Pressable>
                </View>
                <Text style={styles.heroIndex}>01 / 04</Text>
              </View>
            )}

            {!query && activeTab === 'Home' && (
              <View style={styles.section}>
                <View style={styles.sectionHeading}><View><Text style={styles.kicker}>HANDPICKED FOR YOU</Text><Text style={styles.sectionTitle}>Made for your mood</Text></View><Pressable onPress={() => setActiveTab('Explore')}><Text style={styles.seeAll}>Explore all  ↗</Text></Pressable></View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playlistRail}>
                  {playlists.map((playlist, index) => <Pressable key={playlist.name} onPress={() => { setActiveTab('Explore'); setQuery(index === 0 ? 'night' : ''); }} style={styles.playlistCard}><View style={styles.playlistArtWrap}><Image source={{ uri: playlist.image }} style={styles.playlistArt} /><View style={styles.artPlay}><Text style={styles.artPlayText}>▶</Text></View></View><Text numberOfLines={1} style={styles.playlistName}>{playlist.name}</Text><Text numberOfLines={1} style={styles.playlistSubtitle}>{playlist.subtitle}</Text></Pressable>)}
                </ScrollView>
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeading}><View><Text style={styles.kicker}>{query ? 'FIND YOUR NEXT FAVORITE' : 'A FEW GOOD SOUNDS'}</Text><Text style={styles.sectionTitle}>{sectionTitle}</Text></View><Text style={styles.trackCount}>{visibleTracks.length} tracks</Text></View>
              {visibleTracks.length ? <View>{visibleTracks.map((track, index) => renderTrack(track, index))}</View> : <View style={styles.emptyState}><Text style={styles.emptyIcon}>{activeTab === 'Library' ? '♡' : '⌕'}</Text><Text style={styles.emptyTitle}>{activeTab === 'Library' ? 'Your library is waiting' : 'No matches just yet'}</Text><Text style={styles.emptyCopy}>{activeTab === 'Library' ? 'Tap the heart on a song to save it here.' : 'Try another song, artist, or album.'}</Text></View>}
            </View>
            <View style={styles.footer}><Text style={styles.footerText}>A little more music, a little more you.  ✦</Text></View>
          </ScrollView>

          {compact && <View style={styles.mobileNav}>{navItems.map((item) => <Pressable key={item.label} onPress={() => { setActiveTab(item.label); setQuery(''); }} style={styles.mobileNavItem}><Text style={[styles.mobileNavIcon, activeTab === item.label && styles.accentText]}>{item.icon}</Text><Text style={[styles.mobileNavLabel, activeTab === item.label && styles.mobileNavLabelActive]}>{item.label}</Text></Pressable>)}</View>}
          <View style={styles.player}>
            <View style={styles.nowPlaying}>
              {current ? <Image source={{ uri: current.artwork }} style={styles.playerArt} /> : <View style={[styles.playerArt, styles.playerArtPlaceholder]}><Text style={styles.placeholderNote}>♫</Text></View>}
              <View style={styles.playerTrackInfo}><Text numberOfLines={1} style={styles.playerTitle}>{current?.title ?? 'Pick a song to get started'}</Text><Text numberOfLines={1} style={styles.playerArtist}>{current?.artist ?? 'Your next favorite is waiting'}</Text></View>
              {current && <Pressable onPress={() => toggleLike(current.id)} style={styles.playerHeart}><Text style={[styles.heart, liked.includes(current.id) && styles.heartLiked]}>{liked.includes(current.id) ? '♥' : '♡'}</Text></Pressable>}
            </View>
            <View style={styles.playerControls}><View style={styles.controlButtons}><Pressable onPress={() => { if (current) { const i = tracks.findIndex((t) => t.id === current.id); void playTrack(tracks[(i - 1 + tracks.length) % tracks.length]); } }}><Text style={styles.secondaryControl}>‹</Text></Pressable><Pressable style={styles.playButton} onPress={() => current ? void playTrack(current) : void playTrack(tracks[0])}><Text style={styles.playButtonText}>{playing ? 'Ⅱ' : '▶'}</Text></Pressable><Pressable onPress={() => { if (current) { const i = tracks.findIndex((t) => t.id === current.id); void playTrack(tracks[(i + 1) % tracks.length]); } }}><Text style={styles.secondaryControl}>›</Text></Pressable></View><View style={styles.progressRow}><Text style={styles.timeText}>0:00</Text><View style={styles.progressTrack}><View style={[styles.progressFill, { width: playing ? '34%' : '0%' }]} /></View><Text style={styles.timeText}>{current?.duration ?? '0:00'}</Text></View></View>
            <View style={styles.playerExtras}><Text style={styles.extraIcon}>☷</Text><Text style={styles.volumeIcon}>◖</Text><View style={styles.volumeTrack}><View style={styles.volumeFill} /></View></View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#090b10' }, appShell: { flex: 1, flexDirection: 'row', backgroundColor: '#090b10' },
  sidebar: { width: 238, backgroundColor: '#0c0e14', borderRightWidth: 1, borderRightColor: '#1b1d27', paddingHorizontal: 24, paddingTop: 26 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 }, brandMark: { width: 31, height: 31, borderRadius: 10, backgroundColor: '#c9f36a', alignItems: 'center', justifyContent: 'center' }, brandMarkText: { color: '#11150a', fontSize: 19, fontWeight: '900' }, brand: { color: '#f5f5f7', fontSize: 21, fontWeight: '800', letterSpacing: -0.8 }, brandAccent: { color: '#c9f36a' },
  navCaption: { color: '#707380', fontSize: 10, fontWeight: '800', letterSpacing: 1.8, marginTop: 43, marginBottom: 13 }, navItem: { height: 44, flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 5 }, navItemActive: { backgroundColor: '#1a1d24' }, navIcon: { color: '#888b98', width: 18, fontSize: 20, textAlign: 'center' }, navLabel: { color: '#a5a7b0', fontSize: 13, fontWeight: '500' }, navLabelActive: { color: '#f6f7f4', fontWeight: '700' }, accentText: { color: '#c9f36a' }, sidebarDivider: { height: 1, backgroundColor: '#20222b', marginTop: 20 }, sidebarBottom: { marginTop: 'auto', paddingVertical: 22, borderTopWidth: 1, borderTopColor: '#20222b', flexDirection: 'row', alignItems: 'center', gap: 10 }, avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#282b36', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#c9f36a', fontWeight: '800' }, profileName: { color: '#f1f1f4', fontSize: 12, fontWeight: '700' }, profileStatus: { color: '#838592', fontSize: 10, marginTop: 3 }, more: { color: '#8a8c97', marginLeft: 'auto', fontSize: 19 },
  mainColumn: { flex: 1, minWidth: 0 }, topbar: { height: 78, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 34, gap: 18, borderBottomWidth: 1, borderBottomColor: '#1a1c24' }, searchBox: { width: 390, height: 42, borderRadius: 12, backgroundColor: '#151720', borderWidth: 1, borderColor: '#242630', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 10 }, searchBoxCompact: { flex: 1, width: undefined, height: 39, paddingHorizontal: 10 }, searchIcon: { color: '#989aa5', fontSize: 21 }, searchInput: { flex: 1, color: '#f3f3f4', fontSize: 12, outlineStyle: 'none' as any }, upgradeButton: { marginLeft: 'auto', backgroundColor: '#c9f36a', paddingVertical: 11, paddingHorizontal: 15, borderRadius: 10 }, upgradeText: { color: '#171b11', fontSize: 11, fontWeight: '800' },
  scrollArea: { flex: 1 }, content: { paddingHorizontal: 34, paddingTop: 27, paddingBottom: 30, maxWidth: 1240, width: '100%', alignSelf: 'center' }, hero: { height: 268, overflow: 'hidden', borderRadius: 19, backgroundColor: '#252332', justifyContent: 'center', marginBottom: 33 }, heroImage: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.55 }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10,11,16,0.38)' }, heroContent: { paddingLeft: 35, maxWidth: 560 }, eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 13 }, liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#c9f36a' }, eyebrowText: { color: '#d2f98a', fontSize: 10, fontWeight: '800', letterSpacing: 1.7 }, heroTitle: { color: '#fff', fontSize: 35, lineHeight: 41, fontWeight: '800', letterSpacing: -1.2 }, heroSubtitle: { color: '#dcdae2', fontSize: 12, marginTop: 9, lineHeight: 19 }, heroButton: { alignSelf: 'flex-start', marginTop: 18, backgroundColor: '#c9f36a', borderRadius: 9, paddingVertical: 11, paddingHorizontal: 17 }, heroButtonText: { color: '#14170d', fontSize: 11, fontWeight: '800' }, heroIndex: { position: 'absolute', right: 22, bottom: 20, color: '#dedee3', fontSize: 10, letterSpacing: 1 },
  section: { marginBottom: 28 }, sectionHeading: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }, kicker: { color: '#9496a2', fontSize: 9, letterSpacing: 1.7, fontWeight: '800', marginBottom: 6 }, sectionTitle: { color: '#f5f5f7', fontSize: 21, fontWeight: '800', letterSpacing: -0.55 }, seeAll: { color: '#c9f36a', fontSize: 11, fontWeight: '700', marginBottom: 3 }, trackCount: { color: '#858793', fontSize: 11, marginBottom: 3 }, playlistRail: { gap: 15, paddingBottom: 4 }, playlistCard: { width: 165 }, playlistArtWrap: { position: 'relative', marginBottom: 11 }, playlistArt: { width: 165, height: 135, borderRadius: 12, backgroundColor: '#242632' }, artPlay: { position: 'absolute', right: 9, bottom: 9, width: 32, height: 32, borderRadius: 16, backgroundColor: '#c9f36a', alignItems: 'center', justifyContent: 'center', opacity: 0.95 }, artPlayText: { color: '#15180e', fontSize: 12 }, playlistName: { color: '#f0f0f2', fontSize: 12, fontWeight: '700' }, playlistSubtitle: { color: '#898b97', fontSize: 10, marginTop: 4 },
  trackRow: { minHeight: 62, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, borderRadius: 10, gap: 13 }, trackRowActive: { backgroundColor: '#171a20' }, trackNumber: { width: 18, alignItems: 'center' }, mutedText: { color: '#737682', fontSize: 10 }, equalizer: { color: '#c9f36a', fontSize: 15 }, trackImage: { width: 42, height: 42, borderRadius: 7, backgroundColor: '#252735' }, trackInfo: { flex: 1, minWidth: 0 }, trackTitle: { color: '#ececf0', fontSize: 12, fontWeight: '700' }, trackArtist: { color: '#8d8f9b', fontSize: 10, marginTop: 5 }, likeButton: { padding: 5 }, heart: { color: '#82848e', fontSize: 18 }, heartLiked: { color: '#c9f36a' }, duration: { color: '#8d8f99', fontSize: 10, width: 35, textAlign: 'right' }, rowPlay: { width: 27, alignItems: 'center' }, rowPlayText: { color: '#c9f36a', fontSize: 12 }, emptyState: { alignItems: 'center', paddingVertical: 40 }, emptyIcon: { color: '#c9f36a', fontSize: 30 }, emptyTitle: { color: '#f1f1f4', fontSize: 15, fontWeight: '700', marginTop: 12 }, emptyCopy: { color: '#9294a0', fontSize: 11, marginTop: 7 }, footer: { paddingVertical: 14, alignItems: 'center' }, footerText: { color: '#686b76', fontSize: 10 },
  player: { height: 84, borderTopWidth: 1, borderTopColor: '#252731', backgroundColor: '#101218', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 23, gap: 20 }, nowPlaying: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 11 }, playerArt: { width: 46, height: 46, borderRadius: 7, backgroundColor: '#252735' }, playerArtPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#20232c' }, placeholderNote: { color: '#c9f36a', fontSize: 22 }, playerTrackInfo: { minWidth: 0, maxWidth: 210 }, playerTitle: { color: '#f1f1f4', fontSize: 11, fontWeight: '700' }, playerArtist: { color: '#9294a0', fontSize: 10, marginTop: 4 }, playerHeart: { paddingHorizontal: 5 }, playerControls: { width: '40%', maxWidth: 390, minWidth: 190, alignItems: 'center' }, controlButtons: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22, height: 38 }, secondaryControl: { color: '#afb1bb', fontSize: 24, fontWeight: '500' }, playButton: { width: 31, height: 31, borderRadius: 16, backgroundColor: '#c9f36a', alignItems: 'center', justifyContent: 'center' }, playButtonText: { color: '#12150b', fontSize: 11, fontWeight: '800' }, progressRow: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 8 }, timeText: { color: '#868893', fontSize: 8 }, progressTrack: { height: 3, flex: 1, borderRadius: 3, backgroundColor: '#333540', overflow: 'hidden' }, progressFill: { height: 3, backgroundColor: '#c9f36a' }, playerExtras: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }, extraIcon: { color: '#a5a7b1', fontSize: 16 }, volumeIcon: { color: '#a5a7b1', fontSize: 15 }, volumeTrack: { width: 62, height: 3, borderRadius: 3, backgroundColor: '#3a3c46' }, volumeFill: { width: '65%', height: 3, backgroundColor: '#a5a7b1' },
  mobileNav: { height: 52, backgroundColor: '#101218', borderTopWidth: 1, borderTopColor: '#23252e', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }, mobileNavItem: { alignItems: 'center', justifyContent: 'center', minWidth: 60 }, mobileNavIcon: { color: '#9294a0', fontSize: 17 }, mobileNavLabel: { color: '#9294a0', fontSize: 9, marginTop: 1 }, mobileNavLabelActive: { color: '#c9f36a' },
});
