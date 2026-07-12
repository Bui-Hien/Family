package com.family.common.util;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugUtils {
    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");
    private static final Pattern EDGES = Pattern.compile("(^-|-$)");

    public static String toSlug(String input) {
        if (input == null || input.trim().isEmpty()) {
            return "";
        }
        
        // Remove accents / Vietnamese diacritics
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(normalized).replaceAll("");

        // Handle specific Vietnamese character replacements
        slug = slug.replace("đ", "d").replace("Đ", "d");

        slug = WHITESPACE.matcher(slug).replaceAll("-");
        slug = slug.toLowerCase(Locale.ENGLISH);
        slug = NONLATIN.matcher(slug).replaceAll("");
        slug = EDGES.matcher(slug).replaceAll("");
        
        return slug;
    }
}
