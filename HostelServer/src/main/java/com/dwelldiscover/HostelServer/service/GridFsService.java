package com.dwelldiscover.HostelServer.service;

import com.mongodb.client.gridfs.GridFSBucket;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GridFsService {

    @Autowired
    private GridFSBucket gridFSBucket;

    public String store(MultipartFile file) {
        try {
            ObjectId id = gridFSBucket.uploadFromStream(
                    file.getOriginalFilename(),
                    file.getInputStream()
            );
            return id.toHexString();
        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }
}

