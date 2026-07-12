import React, { useCallback, useEffect, useRef } from "react";
import { useField, useFormikContext } from "formik";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { FormControl, FormHelperText, FormLabel, Box, useTheme } from "@mui/material";

import { saveFilePublic } from "@/services/FileDescriptionService";
import { API_ENDPOINT } from "@/common/appConfig";
import EditorToolbar from "./EditorToolbar";

const CommonEditor = ({ name, label, disabled = false, minHeight = 500, ...props }) => {
    const theme = useTheme();
    const [field, meta] = useField(name);
    const { setFieldValue, setFieldTouched } = useFormikContext();

    // ─── Tối ưu sâu: Sử dụng Ref để tránh Stale Closure bên trong Tiptap Core ───
    const stateRef = useRef({
        value: field.value || "",
        disabled: disabled,
        name: name
    });

    // Đồng bộ nhanh các giá trị prop vào Ref mà không gây re-render
    useEffect(() => {
        stateRef.current.value = field.value || "";
        stateRef.current.disabled = disabled;
        stateRef.current.name = name;
    }, [field.value, disabled, name]);

    // ─── Xử lý luồng tải ảnh lên máy chủ ─────────────────────────────────────
    const uploadImageToServer = useCallback(async (file) => {
        try {
            const response = await saveFilePublic(file);
            return `${API_ENDPOINT}/api/files/public/${response?.data?.data?.id}`;
        } catch (err) {
            console.error("Lỗi upload ảnh:", err);
            return null;
        }
    }, []);

    // ─── Cấu hình Tiptap Core độc lập ─────────────────────────────────────────
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Tối ưu: Tắt các tính năng không cần thiết để tăng tốc độ parse DOM
                dropcursor: false,
            }),
            Image.configure({
                allowBase64: false, // Ngăn chặn tuyệt đối lưu ảnh base64 làm phình DB
            }),
        ],
        content: stateRef.current.value,
        editable: !stateRef.current.disabled,

        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const cleanValue = html === "<p></p>" ? "" : html;

            // Khắc phục Cursor Jumping: Chỉ cập nhật Formik khi giá trị thực sự khác biệt
            if (stateRef.current.value !== cleanValue) {
                stateRef.current.value = cleanValue; // Cập nhật local ref trước
                setFieldValue(stateRef.current.name, cleanValue, false); // false: hoãn validate để tránh lag
            }
        },
        onBlur: () => {
            setFieldTouched(stateRef.current.name, true, true);
        },
        editorProps: {
            // Tối ưu Paste Ảnh thông qua Event Pipeline của ProseMirror
            handlePaste: (view, event) => {
                if (stateRef.current.disabled) return false;

                const items = event.clipboardData?.items;
                const imageItem = Array.from(items || []).find((item) => item.type.includes("image"));

                if (imageItem) {
                    event.preventDefault();
                    const file = imageItem.getAsFile();
                    if (file) {
                        uploadImageToServer(file).then((url) => {
                            if (url && view && !view.isDestroyed) {
                                const { schema } = view.state;
                                const node = schema.nodes.image.create({ src: url });
                                const transaction = view.state.tr.replaceSelectionWith(node);
                                view.dispatch(transaction);
                            }
                        });
                    }
                    return true; // Ngắt bubble event dán dữ liệu gốc
                }
                return false;
            },
        },
    });

    // ─── Kiểm soát đồng bộ Editable State từ Prop ─────────────────────────────
    useEffect(() => {
        if (editor && !editor.isDestroyed) {
            editor.setEditable(!disabled);
        }
    }, [disabled, editor]);

    // ─── Kiểm soát đồng bộ dữ liệu từ API bên ngoài vào Editor ────────────────
    useEffect(() => {
        if (!editor || editor.isDestroyed) return;

        const currentEditorHtml = editor.getHTML();
        const externalHtml = field.value || "";

        // Chỉ nạp lại nội dung khi dữ liệu từ Formik thay đổi do tác nhân bên ngoài (như Fetch API chi tiết)
        if (externalHtml !== currentEditorHtml && externalHtml !== "<p></p>") {
            // Giữ vị trí con trỏ nếu có thể bằng cách kiểm tra trạng thái focus
            const { from, to } = editor.state.selection;
            editor.commands.setContent(externalHtml, false);
            if (editor.isFocused) {
                editor.commands.setTextSelection({ from, to });
            }
        }
    }, [field.value, editor]);

    // ─── Trigger click mở file manager trên máy tính ─────────────────────────
    const handleSelectImageClick = useCallback(async () => {
        if (stateRef.current.disabled || !editor) return;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async () => {
            const file = input.files?.[0];
            if (file) {
                const url = await uploadImageToServer(file);
                if (url && !editor.isDestroyed) {
                    editor.chain().focus().setImage({ src: url }).run();
                }
            }
        };
        input.click();
    }, [editor, uploadImageToServer]);

    const hasError = Boolean(meta.touched && meta.error);

    return (
        <FormControl error={hasError} fullWidth>
            {label && (
                <FormLabel sx={{ mb: 1, fontWeight: 500, color: hasError ? "error.main" : "text.primary" }}>
                    {label}
                </FormLabel>
            )}

            <Box
                sx={{
                    border: "1px solid",
                    borderColor: hasError ? "error.main" : "divider",
                    borderRadius: 1,
                    overflow: "hidden",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    backgroundColor: disabled ? "action.hover" : "background.paper",
                    "&:hover": {
                        borderColor: disabled ? "divider" : hasError ? "error.main" : "text.secondary",
                    },
                    "&:focus-within": {
                        borderColor: hasError ? "error.main" : "primary.main",
                        boxShadow: hasError ? `0 0 0 1px ${theme.palette.error.main}` : `0 0 0 1px ${theme.palette.primary.main}`,
                    },
                }}
            >
                <EditorToolbar
                    editor={editor}
                    onImageUpload={handleSelectImageClick}
                    disabled={disabled}
                />

                <Box
                    sx={{
                        "& .ProseMirror": {
                            minHeight: `${minHeight}px`,
                            maxHeight: "75vh",
                            overflowY: "auto",
                            padding: 2,
                            outline: "none",
                            color: disabled ? "text.disabled" : "text.primary",
                            cursor: disabled ? "not-allowed" : "text",
                            "& p": { margin: 0, paddingBottom: "8px" },
                            "& img": {
                                maxWidth: "100%",
                                height: "auto",
                                borderRadius: 1,
                                display: "block",
                                margin: "12px 0",
                            },
                        },
                    }}
                >
                    <EditorContent editor={editor} {...props} />
                </Box>
            </Box>

            {hasError && (
                <FormHelperText sx={{ mx: 1, mt: 0.5 }}>{meta.error}</FormHelperText>
            )}
        </FormControl>
    );
};

export default React.memo(CommonEditor);