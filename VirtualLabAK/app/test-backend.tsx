/**
 * Test Backend Connection
 * 
 * Gunakan component ini untuk test apakah backend Supabase
 * sudah terhubung dengan benar
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView } from 'react-native';
import { testSupabaseConnection } from '@/lib/supabase';
import { 
  login, 
  register, 
  addQuizScore,
  addJournalEntry,
  getProfile 
} from '@/lib/supabase';

export default function TestBackendScreen() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Testing...');
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    const connected = await testSupabaseConnection();
    setConnectionStatus(connected ? '✅ Connected' : '❌ Not Connected');
    addResult(connected ? '✅ Supabase connected successfully' : '❌ Failed to connect');
  };

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRegister = async () => {
    addResult('📝 Testing registration...');
    const result = await register({
      email: 'testuser@example.com',
      password: 'test123',
      name: 'Test User',
      nim: '18221001',
      kelas: 'K01',
      gender: 'Laki-laki',
    });

    if (result.success) {
      addResult(`✅ Register: ${result.message}`);
      Alert.alert('Success', result.message);
    } else {
      addResult(`❌ Register: ${result.message}`);
      Alert.alert('Error', result.message);
    }
  };

  const testLogin = async () => {
    addResult('🔐 Testing login...');
    const result = await login({
      email: 'testuser@example.com',
      password: 'test123',
    });

    if (result.success && result.user) {
      addResult(`✅ Login: ${result.message}`);
      addResult(`   User ID: ${result.user.id}`);
      Alert.alert('Success', `Logged in as ${result.user.email}`);
    } else {
      addResult(`❌ Login: ${result.message}`);
      Alert.alert('Error', result.message);
    }
  };

  const testQuizScore = async () => {
    addResult('📝 Testing quiz score submission...');
    // Note: Replace with real userId after login
    const testUserId = 'your-user-id-here';
    
    const result = await addQuizScore(testUserId, 85, 100, 'test-quiz-1');
    
    if (result.success) {
      addResult(`✅ Quiz Score: Submitted successfully`);
      addResult(`   Score: ${result.data?.score}/${result.data?.maxScore}`);
      addResult(`   Percentage: ${result.data?.percentage}%`);
      Alert.alert('Success', 'Quiz score added!');
    } else {
      addResult(`❌ Quiz Score: ${result.message}`);
      Alert.alert('Error', result.message);
    }
  };

  const testJournal = async () => {
    addResult('📔 Testing journal entry...');
    // Note: Replace with real userId after login
    const testUserId = 'your-user-id-here';
    
    const result = await addJournalEntry(
      testUserId, 
      'Test Journal Entry',
      'This is a test content for journal entry.'
    );
    
    if (result.success) {
      addResult(`✅ Journal: Created successfully`);
      addResult(`   Entry ID: ${result.data?.entryId}`);
      Alert.alert('Success', 'Journal entry created!');
    } else {
      addResult(`❌ Journal: ${result.message}`);
      Alert.alert('Error', result.message);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Backend Integration Test</Text>
        <Text style={styles.status}>{connectionStatus}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Test Connection" onPress={testConnection} />
        <View style={styles.spacer} />
        
        <Button title="Test Register" onPress={testRegister} />
        <View style={styles.spacer} />
        
        <Button title="Test Login" onPress={testLogin} />
        <View style={styles.spacer} />
        
        <Button title="Test Quiz Score" onPress={testQuizScore} />
        <View style={styles.spacer} />
        
        <Button title="Test Journal" onPress={testJournal} />
        <View style={styles.spacer} />
        
        <Button title="Clear Results" onPress={clearResults} color="#666" />
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultItem}>
            {result}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  spacer: {
    height: 12,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resultItem: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
    lineHeight: 18,
  },
});
