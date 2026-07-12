package com.family.common.util;

import net.jpountz.lz4.LZ4Compressor;
import net.jpountz.lz4.LZ4Factory;
import net.jpountz.lz4.LZ4SafeDecompressor;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.UUID;

public class FileUtils {

    private static final LZ4Factory factory = LZ4Factory.fastestInstance();

    public static byte[] compress(byte[] data) {
        LZ4Compressor compressor = factory.fastCompressor();
        int maxCompressedLength = compressor.maxCompressedLength(data.length);
        byte[] compressed = new byte[maxCompressedLength];
        int compressedLength = compressor.compress(data, 0, data.length, compressed, 0, maxCompressedLength);
        
        // Trim to exact size
        byte[] result = new byte[compressedLength];
        System.arraycopy(compressed, 0, result, 0, compressedLength);
        return result;
    }

    public static byte[] decompress(byte[] compressedData, int originalLength) {
        LZ4SafeDecompressor decompressor = factory.safeDecompressor();
        byte[] decompressed = new byte[originalLength];
        decompressor.decompress(compressedData, 0, compressedData.length, decompressed, 0);
        return decompressed;
    }

    public static String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
    }

    public static boolean isImage(String fileName) {
        String ext = getFileExtension(fileName);
        return "jpg".equals(ext) || "jpeg".equals(ext) || "png".equals(ext) || "gif".equals(ext) || "webp".equals(ext) || "bmp".equals(ext);
    }

    public static String generateUniqueFileName(String originalName) {
        String ext = getFileExtension(originalName);
        String nameWithoutExt = originalName;
        if (!ext.isEmpty()) {
            nameWithoutExt = originalName.substring(0, originalName.lastIndexOf("."));
        }
        return SlugUtils.toSlug(nameWithoutExt) + "-" + UUID.randomUUID().toString().substring(0, 8) + (ext.isEmpty() ? "" : "." + ext);
    }
}
