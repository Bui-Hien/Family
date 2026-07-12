package com.family.common.util;

import net.coobird.thumbnailator.Thumbnails;
import java.io.File;
import java.io.IOException;

public class ImageUtils {

    public static void resize(File source, File destination, int width, int height) throws IOException {
        // Ensure parent directories exist
        File parent = destination.getParentFile();
        if (parent != null && !parent.exists()) {
            parent.mkdirs();
        }

        Thumbnails.of(source)
                .size(width, height)
                .keepAspectRatio(true)
                .toFile(destination);
    }
}
