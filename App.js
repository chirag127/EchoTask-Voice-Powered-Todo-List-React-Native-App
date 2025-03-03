import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  // Load tasks from AsyncStorage
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const savedTasks = await AsyncStorage.getItem('tasks');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
  };

  const saveTasks = async (newTasks) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  // Add Task
  const addTask = () => {
    if (task.trim()) {
      const newTasks = [...tasks, { id: Date.now().toString(), text: task }];
      setTasks(newTasks);
      saveTasks(newTasks);
      setTask('');
    }
  };

  // Speech-to-Text (Simulated)
  const handleVoiceInput = () => {
    Speech.speak('Say your task after the beep', {
      onDone: async () => {
        setTimeout(() => {
          const voiceTask = 'Buy groceries'; // Simulated voice input (replace with real STT)
          setTask(voiceTask);
        }, 2000);
      },
    });
  };

  // Set Reminder
  const setReminder = async (taskText, timeInSeconds) => {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Task Reminder', body: taskText },
      trigger: { seconds: timeInSeconds },
    });
    Alert.alert('Reminder Set!', `You will be reminded in ${timeInSeconds} seconds.`);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20 }}>🎤 Voice Todo List</Text>
      <TextInput
        placeholder="Enter task or use voice"
        value={task}
        onChangeText={setTask}
        style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
      <Button title="🎙 Add Task via Voice" onPress={handleVoiceInput} />
      <Button title="➕ Add Task" onPress={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
            <Text>{item.text}</Text>
            <Button title="⏰ Set Reminder (5s)" onPress={() => setReminder(item.text, 5)} />
          </View>
        )}
      />
    </View>
  );
}
