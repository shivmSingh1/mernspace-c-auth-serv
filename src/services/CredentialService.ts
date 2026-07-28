import bcrypt from 'bcrypt';
export class CredentialService {
    async comparePassword(password: string, hashedPassword: string) {
        const isMatched = await bcrypt.compare(password, hashedPassword);
        return isMatched;
    }
}
