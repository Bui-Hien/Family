import React from "react";
import { Box, IconButton, Divider, Tooltip } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ImageIcon from "@mui/icons-material/Image";
import TitleIcon from "@mui/icons-material/Title";

const EditorToolbar = React.memo(({ editor, onImageUpload, disabled }) => {
    if (!editor) return null;

    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                p: 0.75,
                borderBottom: "1px solid",
                borderColor: "divider",
                backgroundColor: disabled ? "action.hover" : "background.default",
                alignItems: "center"
            }}
        >
            <Tooltip title="Heading 2">
                <IconButton
                    size="small"
                    disabled={disabled}
                    color={editor.isActive("heading", { level: 2 }) ? "primary" : "default"}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <TitleIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

            <Tooltip title="In đậm">
                <IconButton
                    size="small"
                    disabled={disabled}
                    color={editor.isActive("bold") ? "primary" : "default"}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <FormatBoldIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="In nghiêng">
                <IconButton
                    size="small"
                    disabled={disabled}
                    color={editor.isActive("italic") ? "primary" : "default"}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <FormatItalicIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Gạch ngang">
                <IconButton
                    size="small"
                    disabled={disabled}
                    color={editor.isActive("strike") ? "primary" : "default"}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <StrikethroughSIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

            <Tooltip title="Danh sách dấu chấm">
                <IconButton
                    size="small"
                    disabled={disabled}
                    color={editor.isActive("bulletList") ? "primary" : "default"}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <FormatListBulletedIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Danh sách số">
                <IconButton
                    size="small"
                    disabled={disabled}
                    color={editor.isActive("orderedList") ? "primary" : "default"}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <FormatListNumberedIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

            <Tooltip title="Chèn hình ảnh">
                <IconButton size="small" disabled={disabled} onClick={onImageUpload} color="default">
                    <ImageIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </Box>
    );
});

export default EditorToolbar;