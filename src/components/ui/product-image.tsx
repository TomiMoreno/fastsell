"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "~/lib/utils";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  size?: "sm" | "md" | "lg";
  fill?: boolean;
}

export function ProductImage({
  src,
  alt,
  className,
  fallbackClassName,
  size = "md",
  fill = false,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);

  // Generar iniciales del nombre del producto
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Obtener texto para mostrar (iniciales o nombre completo)
  const getDisplayText = (name: string) => {
    if (fill) {
      // En modo fill, mostrar nombre completo (limitado a 20 caracteres)
      return name.length > 20 ? name.slice(0, 20) + "..." : name;
    }
    // En modo normal, mostrar iniciales
    return getInitials(name);
  };

  // Tamaños predefinidos
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  // Tamaños para modo fill (imágenes grandes)
  const fillSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const imageSizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  // Si no hay src o hay error, mostrar iniciales
  if (!src || imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded bg-muted font-medium text-muted-foreground",
          fill ? "absolute inset-0" : sizeClasses[size],
          fill ? fillSizeClasses[size] : "",
          fallbackClassName,
        )}
      >
        {getDisplayText(alt)}
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        className={cn("rounded object-cover", className)}
        fill
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={cn("rounded object-cover", imageSizeClasses[size], className)}
      width={size === "sm" ? 32 : size === "md" ? 40 : 64}
      height={size === "sm" ? 32 : size === "md" ? 40 : 64}
      onError={() => setImageError(true)}
    />
  );
}
