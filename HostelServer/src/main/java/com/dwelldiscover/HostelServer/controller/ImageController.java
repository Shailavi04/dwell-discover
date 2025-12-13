package com.dwelldiscover.HostelServer.controller;

import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSDownloadStream;
import jakarta.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/images")
@CrossOrigin("*")
public class ImageController {

    @Autowired
    private GridFSBucket gridFSBucket;

    @GetMapping("/{id}")
    public void getImage(@PathVariable String id, HttpServletResponse response) throws IOException {

        GridFSDownloadStream stream =
                gridFSBucket.openDownloadStream(new ObjectId(id));

        response.setContentType("image/jpeg"); // works for png/webp too
        response.setHeader("Cache-Control", "public, max-age=31536000");

        stream.transferTo(response.getOutputStream());
    }
}
