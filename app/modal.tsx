import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Modal } from "react-native";

interface EditModalProps {
  visible: boolean;
  initialValue: string;
  onSave: (newValue: string) => void;
  onClose: () => void;
}

export default function EditModal({ visible, initialValue, onSave, onClose }: EditModalProps) {
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    setText(initialValue); // update text when modal opens for different task
  }, [initialValue]);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            autoFocus
            placeholder="Edit task"
          />
          <View style={styles.buttons}>
            <Button title="Cancel" onPress={onClose} />
            <Button
              title="Save"
              onPress={() => {
                onSave(text);
                onClose();
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

