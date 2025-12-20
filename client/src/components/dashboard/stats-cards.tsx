
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Eye, Star, ClipboardList } from "lucide-react";

interface StatsCardsProps {
    totalProperties: number;
    activeProperties: number;
    featuredProperties: number;
    requestedProperties: number;
}

export default function StatsCards({
    totalProperties,
    activeProperties,
    featuredProperties,
    requestedProperties = 0
}: StatsCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Propiedades</CardTitle>
                    <Building2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold" data-testid="total-properties">
                        {totalProperties}
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Propiedades Activas</CardTitle>
                    <Eye className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold" data-testid="active-properties">
                        {activeProperties}
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Destacadas</CardTitle>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold" data-testid="featured-properties">
                        {featuredProperties}
                    </div>
                </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow bg-slate-50 border-slate-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Propiedades Solicitadas</CardTitle>
                    <ClipboardList className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-muted-foreground" data-testid="requested-properties">
                        {requestedProperties}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
