package com.family.common.util;

import java.security.SecureRandom;
import java.util.UUID;

public class UuidUtils {
    private static final SecureRandom random = new SecureRandom();

    public static UUID generateUuidV7() {
        long valueMs = System.currentTimeMillis();
        
        long timestamp = valueMs & 0xFFFFFFFFFFFFL; // 48 bits
        long version = 7L; // 4 bits
        long randA = random.nextInt() & 0x0FFFL; // 12 bits
        
        long mostSigBits = (timestamp << 16) | (version << 12) | randA;
        
        long variant = 2L; // 2 bits (10xx)
        long randB = random.nextLong() & 0x3FFFFFFFFFFFFFFFL; // 62 bits
        
        long leastSigBits = (variant << 62) | randB;
        
        return new UUID(mostSigBits, leastSigBits);
    }
}
