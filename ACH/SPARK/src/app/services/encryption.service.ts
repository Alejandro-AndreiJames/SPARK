import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  encrypt(text: string, key: string): string {
    if (!text || !key) return '';
    
    let result = '';
    const keyHash = this.generateKeyHash(key);
    
    // First layer: XOR with key hash
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = keyHash[i % keyHash.length];
      result += String.fromCharCode(charCode ^ keyChar);
    }
    
    // Second layer: Custom substitution
    result = this.customSubstitution(result);
    
    // Third layer: Base64 encoding with custom alphabet
    return this.customBase64Encode(result);
  }

  decrypt(encryptedText: string, key: string): string {
    if (!encryptedText || !key) return '';
    
    try {
      // Reverse third layer: Base64 decoding
      let result = this.customBase64Decode(encryptedText);
      
      // Reverse second layer: Custom substitution
      result = this.reverseCustomSubstitution(result);
      
      // Reverse first layer: XOR with key hash
      const keyHash = this.generateKeyHash(key);
      let decrypted = '';
      
      for (let i = 0; i < result.length; i++) {
        const charCode = result.charCodeAt(i);
        const keyChar = keyHash[i % keyHash.length];
        decrypted += String.fromCharCode(charCode ^ keyChar);
      }
      
      return decrypted;
    } catch (error) {
      return 'Decryption failed. Invalid key or encrypted text.';
    }
  }

  private generateKeyHash(key: string): number[] {
    const hash: number[] = [];
    let sum = 0;
    
    // Generate a unique hash based on the key
    for (let i = 0; i < key.length; i++) {
      sum = (sum * 31 + key.charCodeAt(i)) >>> 0;
      hash.push(sum % 256);
    }
    
    return hash;
  }

  private customSubstitution(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Shift the character code by a position-dependent value
      result += String.fromCharCode((charCode + i + 7) % 256);
    }
    return result;
  }

  private reverseCustomSubstitution(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Reverse the shift
      result += String.fromCharCode((charCode - i - 7 + 256) % 256);
    }
    return result;
  }

  private customBase64Encode(text: string): string {
    let result = '';
    let i = 0;
    
    while (i < text.length) {
      const chr1 = text.charCodeAt(i++);
      const chr2 = i < text.length ? text.charCodeAt(i++) : NaN;
      const chr3 = i < text.length ? text.charCodeAt(i++) : NaN;

      const enc1 = chr1 >> 2;
      const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      const enc3 = isNaN(chr2) ? 64 : ((chr2 & 15) << 2) | (chr3 >> 6);
      const enc4 = isNaN(chr3) ? 64 : chr3 & 63;

      result += this.chars.charAt(enc1) + this.chars.charAt(enc2) +
                this.chars.charAt(enc3) + this.chars.charAt(enc4);
    }
    
    return result;
  }

  private customBase64Decode(text: string): string {
    let result = '';
    let i = 0;
    
    while (i < text.length) {
      const enc1 = this.chars.indexOf(text.charAt(i++));
      const enc2 = this.chars.indexOf(text.charAt(i++));
      const enc3 = this.chars.indexOf(text.charAt(i++));
      const enc4 = this.chars.indexOf(text.charAt(i++));

      const chr1 = (enc1 << 2) | (enc2 >> 4);
      const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      const chr3 = ((enc3 & 3) << 6) | enc4;

      result += String.fromCharCode(chr1);
      
      if (enc3 !== 64) {
        result += String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        result += String.fromCharCode(chr3);
      }
    }
    
    return result;
  }
}
