export interface CourseDto {
    id: number;
    title: string;
}

export interface CourseDetailsDto {
    id: number;
    title: string;
    teacherUsername: string;
    students: string[];
}

export interface MaterialDto {
    title: string;
    data: string;
    type: "FILE" | "LINK" | "TEXT";
}

export interface EnrollmentRequestDto {
    id: number;
    studentID: number;
    courseName: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface JwtResponse {
    token: string;
}
