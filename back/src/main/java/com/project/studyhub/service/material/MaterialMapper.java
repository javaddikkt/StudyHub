package com.project.studyhub.service.material;

import com.project.studyhub.ServiceException;
import com.project.studyhub.dto.MaterialDto;
import com.project.studyhub.entity.Material;
import com.project.studyhub.entity.MaterialType;
import org.springframework.stereotype.Component;

@Component
public class MaterialMapper {
    public MaterialDto map(Material material) {
        return new MaterialDto(material.getTitle(), material.getData(), material.getType().toString());
    }

    public Material map(MaterialDto materialDto) {
        Material material = new Material();
        material.setTitle(materialDto.getTitle());
        material.setData(materialDto.getData());
        MaterialType type = switch (materialDto.getType()) {
            case "TEXT" -> MaterialType.TEXT;
            case "LINK" -> MaterialType.LINK;
            case "FILE" -> MaterialType.FILE;
            default -> throw new ServiceException("Invalid material type");
        };
        material.setType(type);
        return material;
    }
}
