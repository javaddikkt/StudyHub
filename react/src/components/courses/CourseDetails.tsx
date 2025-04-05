import React, { useEffect, useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {Course} from "./Course.tsx";
import {Material} from "./Material.tsx";
import {getEndpoint} from "./ValidateRole.tsx";

const CourseDetailsPage: React.FC = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [username, setUsername] = useState('');
    const [materialTitle, setMaterialTitle] = useState('');
    const [materialType, setMaterialType] = useState('TEXT');
    const [materialData, setMaterialData] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('jwt');
    const endpoint = getEndpoint(navigate);


    const inviteStudent = async (id: bigint) => {
        try {
            const response = await fetch(`http://localhost:8080/courses/${id}/invite`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: username
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            alert(username + ' invited!')
            window.location.reload();
        } catch (error) {
            alert('Something went wrong!')
            console.log(error);
        }
    }

    const uploadMaterial = async (id: bigint) => {
        const formData = new FormData();
        formData.append("title", materialTitle);
        formData.append("type", materialType);
        if (materialType === "FILE") {
            formData.append("file", materialData);
        } else {
            formData.append("data", materialData);
        }
        try {
            const response = await fetch(`http://localhost:8080/courses/${id}/upload_material`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.statusText);
            }

            alert(username + 'Material uploaded!')
            window.location.reload();
        } catch (error) {
            alert('Something went wrong!')
            console.log(error);
        }
    }

    useEffect(() => {
        fetch(`http://localhost:8080/courses/id/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setCourse(data))
            .catch(err => console.error(err));

        fetch(`http://localhost:8080/courses/${id}/materials`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => setMaterials(data))
            .catch(err => console.error(err));

    }, [id, navigate, token, endpoint]);

    if (!course) return <div>Загрузка...</div>;

    return (
        <div style={{ margin: '50px' }}>
            <h2>{course.name}</h2>
            {endpoint == 'teacher' && (
                <div>
                    <label>
                        Invite student:{' '}
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}/>
                    </label>
                    <button onClick={() => inviteStudent(course?.id)}>
                        Invite
                    </button>
                </div>
                )}
            {endpoint == 'teacher' && (
                <div>
                    <label>
                        {'\n'} Upload material:{'title'}
                        <input
                            value={materialTitle}
                            onChange={e => setMaterialTitle(e.target.value)}/>
                        {'data'}
                        <input
                            value={materialData}
                            onChange={e => setMaterialData(e.target.value)}/>
                    </label>
                    <label>
                        Тип:
                        <select value={materialType} onChange={e => setMaterialType(e.target.value)}>
                            <option value="TEXT">Текст</option>
                            <option value="LINK">Ссылка</option>
                            <option value="FILE">Файл</option>
                        </select>
                    </label>
                    <button onClick={() => uploadMaterial(course?.id)}>
                        Upload
                    </button>
                </div>
            )}
            <ul>
                {materials.map(material => (
                    <li key={material.title}>
                        {material.type === 'LINK' && (
                            <a href={material.data} target="_blank" rel="noopener noreferrer">
                                {material.data}
                            </a>

                        )}
                        {material.type === 'FILE' && (
                            material.title + ': *файл* ' + material.data
                        )}
                        {material.type === 'TEXT' && (
                            material.title + ': ' + material.data
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CourseDetailsPage;

/*
<a href={`/api/materials/download/${material.filePath}`} download>
        {material.title}
      </a>
 */