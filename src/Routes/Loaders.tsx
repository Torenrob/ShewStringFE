import axios from "axios";

interface SignUpData {
	firstName: FormDataEntryValue | null;
	lastName: FormDataEntryValue | null;
	email: FormDataEntryValue | null;
	password: FormDataEntryValue | null;
}

async function signUpLoader({ request }: { request: Request }) {
	const data: FormData = await request.formData();
	const form: SignUpData = { firstName: null, lastName: null, email: null, password: null };
	for (const e of data.entries()) {
		const key: string = e[0];
		const value: FormDataEntryValue = e[1];
		form[key as keyof SignUpData] = value;
	}

	const res = await axios.post("http://localhost:3000/sign-up", form);

	return null;
}

export { signUpLoader };
