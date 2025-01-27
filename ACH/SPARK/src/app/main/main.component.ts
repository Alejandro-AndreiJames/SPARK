import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncryptionService } from '../services/encryption.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  plainText = '';
  encryptedText = '';
  decryptedText = '';
  encryptKey = '';
  decryptKey = '';
  isEncryption = true;
  encryptionResult = '';
  textToDecrypt = '';
  showEncryptKey = false;
  showDecryptKey = false;
  isEncrypting = false;
  encryptionSuccess = false;
  showSuccessModal = false;
  isDecrypting = false;
  showDecryptSuccessModal = false;
  
  constructor(private encryptionService: EncryptionService) {}

  async encrypt() {
    if (!this.plainText || !this.encryptKey) return;
    
    this.isEncrypting = true;
    this.encryptionSuccess = false;
    
    // Simulate encryption delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.encryptionResult = this.encryptionService.encrypt(this.plainText, this.encryptKey);
    this.isEncrypting = false;
    this.encryptionSuccess = true;
    this.showSuccessModal = true;
    
    // Auto hide modal after 2 seconds
    setTimeout(() => {
      this.showSuccessModal = false;
    }, 2000);
  }

  async decrypt() {
    if (!this.textToDecrypt || !this.decryptKey) return;
    
    this.isDecrypting = true;
    
    // Simulate decryption delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    this.decryptedText = this.encryptionService.decrypt(this.textToDecrypt, this.decryptKey);
    this.isDecrypting = false;
    this.showDecryptSuccessModal = true;
    
    // Auto hide modal after 2 seconds
    setTimeout(() => {
      this.showDecryptSuccessModal = false;
    }, 2000);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Optional: Add a temporary success message or tooltip
      console.log('Text copied to clipboard');
    });
  }
}
