import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../constants/theme';

const CommentModal = ({ visible, onClose, issueId }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([
        { id: '1', user: 'Alice', text: 'This is a serious issue!', time: '2h ago', avatar: 'https://i.pravatar.cc/150?img=1' },
        { id: '2', user: 'Bob', text: 'I faced this too.', time: '5h ago', avatar: 'https://i.pravatar.cc/150?img=2' },
    ]);

    const handleSend = () => {
        if (!comment.trim()) return;

        const newComment = {
            id: Date.now().toString(),
            user: 'You',
            text: comment,
            time: 'Just now',
            avatar: 'https://i.pravatar.cc/150?img=3', // Placeholder for current user
        };

        setComments([newComment, ...comments]);
        setComment('');
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableOpacity style={styles.backdrop} onPress={onClose} />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Comments</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={comments}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <View style={styles.commentItem}>
                                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                                <View style={styles.commentContent}>
                                    <View style={styles.commentHeader}>
                                        <Text style={styles.userName}>{item.user}</Text>
                                        <Text style={styles.time}>{item.time}</Text>
                                    </View>
                                    <Text style={styles.commentText}>{item.text}</Text>
                                </View>
                            </View>
                        )}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Add a comment..."
                            placeholderTextColor={COLORS.textTertiary}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, !comment.trim() && styles.sendButtonDisabled]}
                            onPress={handleSend}
                            disabled={!comment.trim()}
                        >
                            <Ionicons
                                name="send"
                                size={20}
                                color={comment.trim() ? COLORS.primary : COLORS.textTertiary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
        backgroundColor: COLORS.card,
        borderTopLeftRadius: RADIUS.xl,
        borderTopRightRadius: RADIUS.xl,
        height: '70%',
        ...SHADOWS.medium,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    listContent: {
        padding: SPACING.md,
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: SPACING.lg,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: RADIUS.full,
        marginRight: SPACING.md,
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xs,
    },
    userName: {
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        fontSize: 14,
    },
    time: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    commentText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        lineHeight: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.card,
    },
    input: {
        flex: 1,
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.full,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        color: COLORS.textPrimary,
        maxHeight: 100,
        marginRight: SPACING.sm,
    },
    sendButton: {
        padding: SPACING.sm,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});

export default CommentModal;
