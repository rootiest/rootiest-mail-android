import React from 'react';
import { Image, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { useShallow } from 'zustand/react/shallow';
import { getContactPhotoForEmail, initialsColor } from '../lib/avatar-utils';
import { useContactPhotoSource } from '../lib/use-contact-photo';
import { useContactsStore } from '../stores/contacts-store';

interface AccountAvatarProps {
  /** The account's own address: a contact with this address lends its photo. */
  email?: string | null;
  /** The account's colour, behind the initials when there is no photo. */
  color: string;
  initials: string;
  size: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * A signed-in account's avatar in the account lists (the switcher, Settings →
 * Accounts, the sign-in account picker): the photo of the contact with the
 * account's address, as the webmail's account switcher shows it, else the
 * initials on the account's colour. Only the open account's contacts are
 * loaded, so another account shows its photo once it has been opened.
 */
export default function AccountAvatar({ email, color, initials, size, style, textStyle }: AccountAvatarProps) {
  const photo = useContactsStore(useShallow((s) => getContactPhotoForEmail(s.contacts, email)));
  const { source, onLoad, onError } = useContactPhotoSource(photo ?? null);
  const frame = { width: size, height: size, borderRadius: size / 2 };

  if (source) {
    return (
      <View style={[styles.container, frame, style]}>
        <Image source={source} style={frame} resizeMode="cover" onLoad={onLoad} onError={onError} />
      </View>
    );
  }
  return (
    <View style={[styles.container, frame, { backgroundColor: color }, style]}>
      <Text style={[{ color: initialsColor(color) }, textStyle]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});
