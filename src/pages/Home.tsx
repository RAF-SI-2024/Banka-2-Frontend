import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";

export default function HomePage() {
    return (


                <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {/* Kartice sa placeholder tekstom */}
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome to BankToo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Explore your financial dashboard and manage transactions effortlessly.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Live Market Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Stay tuned! Market data will be available soon.
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Secure Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                Trade confidently with our secure and fast system.
                            </CardContent>
                        </Card>
                    </div>

                    {/* Placeholder sekcija dok ne stignu pravi podaci */}
                    <div
                        className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center">
                        <p className="text-lg text-muted-foreground">
                            Data loading... Please wait.
                        </p>
                    </div>

                </main>

    )
}
