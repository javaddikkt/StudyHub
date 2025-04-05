package com.project.studyhub.service.material;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path storageDir = Paths.get("uploads");

    @Transactional
    public String save(MultipartFile file) throws IOException {
        if (!Files.exists(storageDir)) {
            Files.createDirectories(storageDir);
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path destination = storageDir.resolve(filename);
        file.transferTo(destination);

        return filename;
    }

    public Resource load(String filename) {
        try {
            Path filePath = storageDir.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File is unavailable: " + filename);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error reading file: " + filename, e);
        }
    }
}
