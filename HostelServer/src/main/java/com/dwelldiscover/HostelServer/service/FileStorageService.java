package com.dwelldiscover.HostelServer.service;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.model.GridFSUploadOptions;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class FileStorageService {

    @Autowired
    private GridFSBucket gridFSBucket;

    // 🔹 Upload file to GridFS
    public String uploadFile(MultipartFile file) throws IOException {
        GridFSUploadOptions options = new GridFSUploadOptions()
                .chunkSizeBytes(358400); // 350KB chunks

        ObjectId fileId = gridFSBucket.uploadFromStream(
                file.getOriginalFilename(),
                file.getInputStream(),
                options
        );

        return fileId.toHexString();
    }

    // 🔹 Download file from GridFS
    public byte[] downloadFile(String fileId) throws IOException {
        var stream = new java.io.ByteArrayOutputStream();
        gridFSBucket.downloadToStream(new ObjectId(fileId), stream);
        return stream.toByteArray();
    }

    // 🔹 Delete file
    public void deleteFile(String fileId) {
        gridFSBucket.delete(new ObjectId(fileId));
    }
}
