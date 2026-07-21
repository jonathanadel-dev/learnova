import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Text,
} from '@react-email/components'

export function VerifyEmail({ name, verifyUrl }: { name: string; verifyUrl: string }) {
    return (
        <Html>
            <Head />
            <Preview>Verify your email to finish setting up Learnova</Preview>
            <Body style={{ backgroundColor: '#0a0a0d', fontFamily: 'sans-serif', padding: '40px 0' }}>
                <Container
                    style={{
                        backgroundColor: '#141417',
                        borderRadius: 8,
                        padding: '32px',
                        maxWidth: 480,
                    }}
                >
                    <Heading style={{ color: '#f4f4f2', fontSize: 20, margin: '0 0 16px' }}>
                        Verify your email
                    </Heading>
                    <Text style={{ color: '#a1a1aa', fontSize: 14, lineHeight: '22px' }}>
                        Hi {name}, click the link below to verify your Learnova account and unlock
                        the rest of the platform.
                    </Text>
                    <Link
                        href={verifyUrl}
                        style={{
                            display: 'inline-block',
                            marginTop: 16,
                            backgroundColor: '#635bff',
                            color: '#ffffff',
                            fontSize: 14,
                            fontWeight: 600,
                            padding: '12px 20px',
                            borderRadius: 6,
                            textDecoration: 'none',
                        }}
                    >
                        Verify email address
                    </Link>
                    <Hr style={{ borderColor: '#26262b', margin: '32px 0 16px' }} />
                    <Text style={{ color: '#71717a', fontSize: 12, lineHeight: '18px' }}>
                        This link expires in 48 hours. If you didn&apos;t create a Learnova
                        account, you can safely ignore this email.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}