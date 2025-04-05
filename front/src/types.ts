export interface CourseDto {
    id: number;
    title: string;
    description?: string;
}

export interface MaterialDto {
    id: number;
    title: string;
    filename?: string;
    type: "FILE" | "LINK" | "TEXT";
    url?: string;
}

export interface EnrollmentRequestDto {
    id: number;
    courseId: number;
    studentUsername: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface JwtResponse {
    token: string;
}
