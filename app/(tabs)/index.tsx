import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditModal from "../modal";
import { Stack } from "expo-router";

const STORAGE_KEY = "@task_list";

export default function TaskLanding() {
  const [tasks, setTasks] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [newTaskPosition, setNewTaskPosition] = useState<"top" | "bottom" | null>(null);

  // Load tasks from storage on mount
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored));
      else setTasks(["Add a task", "Add a task", "Add a task"]);
    })();
  }, []);

  // Save tasks to storage whenever tasks change
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const deleteTask = (index: number) => setTasks(tasks.filter((_, i) => i !== index));

  const openEditModal = (index: number) => {
    setEditIndex(index);
    setNewTaskPosition(null);
    setModalVisible(true);
  };

  const openAddModal = (position: "top" | "bottom") => {
    setEditIndex(null);
    setNewTaskPosition(position);
    setModalVisible(true);
  };

  const saveTask = (text: string) => {
    if (editIndex !== null) {
      // Editing existing task
      const updated = [...tasks];
      updated[editIndex] = text;
      setTasks(updated);
    } else if (newTaskPosition) {
      // Adding new task
      const newTasks =
        newTaskPosition === "top" ? [text, ...tasks] : [...tasks, text];
      setTasks(newTasks);
    }

    // Reset modal state
    setModalVisible(false);
    setEditIndex(null);
    setNewTaskPosition(null);
  };

  const postponeTo5 = (index: number) => {
    if (tasks.length < 5) return postponeToLast(index);
    const task = tasks[index];
    const newTasks = tasks.filter((_, i) => i !== index);
    newTasks.splice(4, 0, task);
    setTasks(newTasks);
  };

  const postponeToLast = (index: number) =>
    setTasks([...tasks.filter((_, i) => i !== index), tasks[index]]);

  const renderTask = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.taskRow}>
      <TouchableOpacity style={styles.button} onPress={() => deleteTask(index)}>
        <Text>[done]</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => openEditModal(index)}>
        <Text>[{item}]</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => postponeTo5(index)}>
        <Text>[Later]</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => postponeToLast(index)}>
        <Text>[Last]</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Octopus" }} />
      <FlatList
        data={tasks.slice(0, 3)} // show only first 3 tasks
        renderItem={renderTask}
        keyExtractor={(_, i) => i.toString()}
      />
      {tasks.length > 3 && (
        <Text style={styles.moreText}>+{tasks.length - 3} more tasks...</Text>
      )}
      <View style={styles.taskRow}>
        <TouchableOpacity style={styles.button} onPress={() => openAddModal("top")}>
          <Text>[New Task (add to top)]</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openAddModal("bottom")}>
          <Text>[New Task (add to bottom)]</Text>
        </TouchableOpacity>
      </View>

      <EditModal
        visible={modalVisible}
        initialValue={editIndex !== null ? tasks[editIndex] : ""}
        onSave={saveTask}
        onClose={() => {
          setModalVisible(false);
          setEditIndex(null);
          setNewTaskPosition(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50, paddingHorizontal: 10 },
  taskRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  button: { marginRight: 10, marginBottom: 5 },
  moreText: { fontStyle: "italic", marginBottom: 10 },
});

