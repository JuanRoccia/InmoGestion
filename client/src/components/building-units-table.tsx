import { useLocation } from "wouter";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Property {
    id: string;
    address: string;
    unitIdentifier?: string;
    bedrooms?: number;
    coveredArea?: number;
    area?: number;
    garages?: number;
    price: string;
    rentPrice?: string;
    currency: string;
    operationType: string;
}

interface BuildingUnitsTableProps {
    units: Property[];
}

export default function BuildingUnitsTable({ units }: BuildingUnitsTableProps) {
    const [, navigate] = useLocation();

    const formatPrice = (price: string | undefined, currency: string) => {
        if (!price) return "-";
        const numPrice = parseFloat(price);
        return `${currency}${numPrice.toLocaleString()}`;
    };

    // Calculate "ambientes" as bedrooms + 1 (common in Argentina real estate)
    const getAmbientes = (bedrooms?: number) => {
        if (bedrooms === undefined || bedrooms === null) return "-";
        return bedrooms + 1;
    };

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Dirección</TableHead>
                        <TableHead className="font-semibold text-center">Ambientes</TableHead>
                        <TableHead className="font-semibold text-center">Dormitorios</TableHead>
                        <TableHead className="font-semibold text-center">Superficie Cubierta</TableHead>
                        <TableHead className="font-semibold text-center">Superficie Total</TableHead>
                        <TableHead className="font-semibold text-center">Cochera</TableHead>
                        <TableHead className="font-semibold text-right">Venta</TableHead>
                        <TableHead className="font-semibold text-right">Alquiler</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {units.map((unit) => (
                        <TableRow
                            key={unit.id}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => navigate(`/propiedades/${unit.id}`)}
                        >
                            <TableCell className="font-medium text-primary">
                                {unit.address}
                                {unit.unitIdentifier && ` - ${unit.unitIdentifier}`}
                            </TableCell>
                            <TableCell className="text-center">
                                {getAmbientes(unit.bedrooms)}
                            </TableCell>
                            <TableCell className="text-center">
                                {unit.bedrooms ?? "-"}
                            </TableCell>
                            <TableCell className="text-center">
                                {unit.coveredArea ? `${unit.coveredArea} m²` : "-"}
                            </TableCell>
                            <TableCell className="text-center">
                                {unit.area ? `${unit.area} m²` : "-"}
                            </TableCell>
                            <TableCell className="text-center">
                                {unit.garages && unit.garages > 0 ? "Sí" : "No"}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {unit.operationType === "venta" || unit.operationType === "temporario"
                                    ? formatPrice(unit.price, unit.currency)
                                    : "-"}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {unit.rentPrice
                                    ? formatPrice(unit.rentPrice, unit.currency)
                                    : unit.operationType === "alquiler"
                                        ? formatPrice(unit.price, unit.currency)
                                        : "-"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
