package com.project.studyhub.dto;

public class MaterialDto {
    private String title;
    private String data;
    private String type;

    public MaterialDto(String title, String data, String type) {
        this.title = title;
        this.data = data;
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
